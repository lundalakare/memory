import { Request, Response } from 'express'

export async function createDeck(req: Request, res: Response) {
  const { name, userId } = req.body

  const deck = await req.prisma.deck.create({
    data: {
      name,
      user: { connect: { id: userId } }
    }
  })

  res.json({
    data: deck
  })
}

export async function getDecks(req: Request, res: Response) {
  const decks = await req.prisma.deck.findMany()

  res.json({
    data: decks
  })
}

export async function getDeck(req: Request, res: Response) {
  const deck = await req.prisma.deck.findOne({
    where: {
      id: req.params.id
    },
    include: {
      notes: {
        select: {
          type: true,
          cards: true
        }
      }
    }
  })

  res.json({
    data: deck
  })
}

export async function updateDeck(req: Request, res: Response) {
  const { id } = req.params
  const { name } = req.body

  const deck = await req.prisma.deck.update({
    where: {
      id
    },
    data: {
      name
    }
  })

  res.json({
    data: deck
  })
}

export async function deleteDeck(req: Request, res: Response) {
  const { id } = req.params

  const deck = await req.prisma.deck.delete({
    where: {
      id
    }
  })

  res.json({
    data: deck
  })
}
