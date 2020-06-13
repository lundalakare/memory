import http from 'http'
import express from 'express'
import cors from 'cors'
import createError, { HttpError } from 'http-errors'

import { PrismaClient } from '@prisma/client'

import { router } from './router'

function createServer () {
  const app = express()

  const prisma = new PrismaClient()

  // Enable CORS
  app.use(cors())

  app.use((req, res, next) => {
    req.prisma = prisma
    next()
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
