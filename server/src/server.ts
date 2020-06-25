import http from 'http'
import express from 'express'
import cors from 'cors'
import createError, { HttpError } from 'http-errors'
import { auth, OpenidRequest } from 'express-openid-connect'

import { PrismaClient } from '@prisma/client'

import { router } from './router'
import { ExpressJoiError } from 'express-joi-validation'

import jose from 'jose'
import { roles, Role } from './roles'

const expressJoiContainerTypes = [
  'body',
  'query',
  'headers',
  'fields',
  'params'
]

type Auth0CallbackRequest = OpenidRequest & {
  appSession?: {
    claims: any;
  };
}

function isExpressJoiError (err: any): err is ExpressJoiError {
  return err?.type && expressJoiContainerTypes.includes(err.type)
}

function createServer () {
  const app = express()

  const prisma = new PrismaClient()

  // app.use((req, res, next) => {
  //   console.log(req.path)
  //   next()
  // })

  app.use(auth({
    required: false,
    auth0Logout: true,
    routes: false,
    appSession: {
      secret: process.env.APP_KEY
    },
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    errorOnRequiredAuth: true,
    async handleCallback(req: Auth0CallbackRequest, res, next) {
      if (!req.appSession || !req.appSession.claims) {
        return null
      }
    
      const user = req.appSession.claims

      // This is where we could update local data if necessary.
      const localUser = await prisma.user.upsert({
        where: { idpSub: user.sub },
        create: {
          idpSub: user.sub,
          roles: {
            set: ['default']
          }
        },
        update: {}
      })

      const userRoles: Role[] = []
      for (const roleName of localUser.roles) {
        userRoles.push(roles[roleName])
      }

      let scopes: string[] = []
      for (const roleName of localUser.roles) {
        scopes = [
          ...scopes,
          ...roles[roleName].scopes
        ]
      }

      const hasAdminAccess = userRoles.some(role => role.admin)

      req.appSession.claims.id = localUser.id
      req.appSession.claims._scopes = scopes
      req.appSession.claims._admin = hasAdminAccess

      next()
    }
  }))

  // Special login handler to return back query parameter
  app.get('/login', (req, res: any) => {
    const returnTo = typeof req.query.back === 'string' && req.query.back.startsWith('/')
      ? req.query.back
      : '/'

    res.openid.login({
      returnTo,
      authorizationParams: req.query.signup ? {
        // eslint-disable-next-line @typescript-eslint/camelcase
        screen_hint: 'signup'
      } : undefined
    })
  })
  app.get('/logout', (req, res: any) => res.openid.logout())

  // Set req.user for convenience
  app.use((req, res, next) => {
    if (req.openid?.user) {
      req.user = req.openid.user
    }
    next()
  })

  // Body parser
  app.use(express.json())

  // Enable CORS
  app.use(cors())

  app.use((req, res, next) => {
    req.prisma = prisma
    next()
  })

  app.get('/', (req, res, next) => {
    res.json(req.user)
  })

  app.use(router)

  /**
   * Catch all if no route was matched. Just throw 404
   */
  app.use((req, res, next) => {
    throw createError(404)
  })
  
  /**
   * Error handler. Handles all errors thrown inside middleware and route
   * handlers/controllers.
   */
  app.use((err: Error|HttpError|ExpressJoiError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // If the error is an HttpError, use it. If not, treat is as a 500-error.
    let error: HttpError
    if (err instanceof HttpError) {
      error = err
    } else
    if (isExpressJoiError(err)) {
      const e: ExpressJoiError = err

      error = createError(400, e.error.message)
    } else
    if (err instanceof jose.errors.JWEInvalid) {
      // This matches the error from express-openid-connect.
      error = createError(401, 'Invalid session')
    } else {
      error = createError(500)
    }

    // If this is a severe error, log it.
    // TODO: Implement proper logging solution.
    if (error.statusCode >= 500) {
      console.error(err)
    }
  
    // Send the error with the appropriate status code and body.
    res
      .status(error.statusCode)
      .json({
        error: {
          name: error.name,
          message: error.message
        }
      })
  })

  const server = http.createServer(app)

  return server
}

export {
  createServer
}
