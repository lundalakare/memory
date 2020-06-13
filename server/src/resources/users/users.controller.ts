import { Request, Response } from 'express'

export async function getUsers(req: Request, res: Response) {
  const users = await req.prisma.user.findMany()

  res.json({
    data: users
  })
}
