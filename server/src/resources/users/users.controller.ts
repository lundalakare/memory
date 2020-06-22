import { Request, Response } from 'express'

export async function createUser(req: Request, res: Response) {
  const { email, password, username } = req.body

  const user = await req.prisma.user.create({
    data: {
      email,
      password,
      username
    }
  })

  res.json({
    data: user
  })
}

export async function getUsers(req: Request, res: Response) {
  const users = await req.prisma.user.findMany({
    include: {
      decks: true,
      noteTypes: true
    }
  })

  res.json({
    data: users
  })
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params

  const user = await req.prisma.user.delete({
    where: {
      id: id
    }
  })

  res.json({
    data: user
  })
}
