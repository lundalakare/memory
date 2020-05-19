import http from 'http'

import { PrismaClient } from '@prisma/client'

function createServer () {
  const server = http.createServer()

  const prisma = new PrismaClient()

  return server
}

export {
  createServer
}
