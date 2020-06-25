declare namespace Express {
  interface Request {
    isAuthenticated (): Boolean
    openid: {
      user: import('./OpenIDUser').OpenIDUser
    },
    user: import('./OpenIDUser').OpenIDUser

    prisma: import('@prisma/client').PrismaClient
  }
}
