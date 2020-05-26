import http from 'http'
import express from 'express'
import { auth, requiresAuth } from 'express-openid-connect'
import cors from 'cors'
import createError, { HttpError } from 'http-errors'
import jsonApi from 'ts-json-api'
import { PrismaClient, UserDelegate, User } from '@prisma/client'

import { buildJsonApi, RelationshipType } from './jsonApi/JsonApi'
import { checkEnv } from './util'

function createServer () {
  // Check that required env vars are present
  checkEnv(['APP_KEY', 'BASE_URL', 'AUTH0_CLIENT_ID', 'AUTH0_ISSUER_BASE_URL'])

  const prisma = new PrismaClient()

  const app = express()

  app.use(auth({
    required: false,
    auth0Logout: true,
    appSession: {
      secret: process.env.APP_KEY
    },
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
  }))

  // Enable CORS
  app.use(cors())

  app.use('/jsonapi', buildJsonApi({
    basePath: '/jsonapi',
    resources: {
      users: {
        attributes: ['username', 'email', 'role'],
        relationships: {
          decks: {
            type: RelationshipType.ToMany,
            related: 'decks'
          }
        },
        dataSource: {
          findOne (id: string) {
            return prisma.user.findOne({
              where: { id }
            })
          },
          findMany () {
            return prisma.user.findMany()
          },
          async findRelated (id: string, relationship: string) {
            const user = await prisma.user
              .findOne({
                where: { id },
                include: {
                  [relationship]: true
                }
              })

            return user[relationship]
          }
        }
      },
      decks: {
        attributes: ['name'],
        relationships: {
          user: {
            type: RelationshipType.ToOne,
            related: 'users'
          }
        },
        dataSource: {
          findOne (id: string) {
            return prisma.deck.findOne({
              where: { id }
            })
          },
          findMany () {
            return prisma.deck.findMany()
          },
          async findRelated (id: string, relationship: string) {
            const deck = await prisma.deck
              .findOne({
                where: { id },
                include: {
                  [relationship]: true
                }
              })

            return deck[relationship]
          }
        }
      },
    }
  }))

  app.get('/', (req, res, next) => {
    res.send(req.isAuthenticated() ? 'Logged in' : 'Logged out')
  })

  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.openid.user))
  })

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
  app.use((err: Error|HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // If the error is an HttpError, use it. If not, treat is as a 500-error.
    let error: HttpError
    if (err instanceof HttpError) {
      error = err
    } else {
      error = createError(500)
    }

    // If this is a severe error, log it.
    // TODO: Implement proper logging solution.
    if (error.statusCode >= 500) {
      console.error('Got error:', error)
      if (!(err instanceof HttpError)) {
        console.error('Original error:', err)
      }
    }

    const response: jsonApi.ResponseWithErrors = {
      errors: [{
        code: error.statusCode.toString(),
        status: error.name,
        title: createError(error.statusCode).message,
        detail: error.message,
      }]
    }
  
    // Send the error with the appropriate status code and body.
    res
      .status(error.statusCode)
      .json(response)
  })

  const server = http.createServer(app)

  return server
}

export {
  createServer
}
