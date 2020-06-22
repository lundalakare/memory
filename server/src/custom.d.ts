declare namespace Express {
  interface Request {
    isAuthenticated (): Boolean
    openid: {
      // user: {
      //   nickname: string,
      //   name: string,
      //   picture: string,
      //   updated_at: string,
      //   email: string,
      //   email_verified: boolean,
      //   sub: string
      // }
      user: typeof import('./OpenIDUser')
    }

    prisma: import('@prisma/client').PrismaClient
  }
}
