declare namespace Express {
  interface Request {
    prisma: import('@prisma/client').PrismaClient
  }
}
