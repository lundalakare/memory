declare namespace Express {
  interface Request {
    isAuthenticated (): Boolean
    openid: {
      user: import('./OpenIDUser').default
    },
    userId: string,

    prisma: import('@prisma/client').PrismaClient
  }
}
