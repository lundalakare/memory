import { Request, Response } from 'express'
import Joi from '@hapi/joi'

import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator
} from 'express-joi-validation'
import { adminOrUserId } from '../../util/authorization'
import createError from 'http-errors'

const validator = createValidator({
  passError: true
})

interface CreateDeckSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
  };
}
export const createDeck = [
  validator.body(Joi.object({
    name: Joi.string().required()
  })),
  async function createDeck(req: ValidatedRequest<CreateDeckSchema>, res: Response) {
    const { name } = req.body
  
    const deck = await req.prisma.deck.create({
      data: {
        name,
        user: { connect: { id: req.userId } }
      }
    })
  
    res.json({
      data: deck
    })
  }
]


export async function getDecks(req: Request, res: Response) {
  const decks = await req.prisma.deck.findMany({
    where: {
      userId: req.userId
    }
  })

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

  const deck = await req.prisma.deck.findOne({
    where: { id }
  })

  if (!adminOrUserId(req, deck.userId)) {
    throw createError(404)
  }

  const updatedDeck = await req.prisma.deck.update({
    where: {
      id
    },
    data: {
      name
    }
  })

  res.json({
    data: updatedDeck
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
