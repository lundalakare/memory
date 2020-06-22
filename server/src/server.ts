import http from 'http'
import express from 'express'
import cors from 'cors'
import createError, { HttpError } from 'http-errors'
import { auth, OpenidRequest } from 'express-openid-connect'

import { PrismaClient } from '@prisma/client'

import { router } from './router'
import OpenIDUser from 'OpenIDUser'
import { ExpressJoiError } from 'express-joi-validation'

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

  app.use(auth({
    required: false,
    auth0Logout: true,
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
          idpSub: user.sub
        },
        update: {}
      })

      req.appSession.claims._localId = localUser.id

      next()
    }
  }))

  app.use(express.json())

  // Enable CORS
  app.use(cors())

  app.use((req, res, next) => {
    req.prisma = prisma
    next()
  })

  app.get('/', (req, res, next) => {
    res.json(req.openid.user)
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
