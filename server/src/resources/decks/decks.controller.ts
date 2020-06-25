import { Request, Response } from 'express'
import Joi from '@hapi/joi'

import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator
} from 'express-joi-validation'

import { adminOrUserId, skipIfAdmin } from '~/util/authorization'
import createError from 'http-errors'
import wrapAsync from '~/util/wrapAsync'

const validator = createValidator({
  passError: true
})

export const getDecks = wrapAsync(async function getDecks(req: Request, res: Response) {
  const decks = await req.prisma.deck.findMany({
    where: {
      userId: skipIfAdmin(req, req.user.id)
    }
  })

  res.json({
    data: decks
  })
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
  wrapAsync(async function createDeck(req: ValidatedRequest<CreateDeckSchema>, res: Response) {
    const deck = await req.prisma.deck.create({
      data: {
        name: req.body.name,
        user: { connect: { id: req.user.id } }
      }
    })
  
    res.json({
      data: deck
    })
  })
]

export const getDeck = wrapAsync(async function getDeck(req: Request, res: Response) {
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

  if (!deck || !adminOrUserId(req, deck.userId)) {
    throw createError(404)
  }

  res.json({
    data: deck
  })
})

interface UpdateDeckSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name?: string;
  };
}
export const updateDeck = [
  validator.body(Joi.object({
    name: Joi.string()
  })),
  wrapAsync(async function updateDeck(req: ValidatedRequest<UpdateDeckSchema>, res: Response) {
    const { id } = req.params

    const deck = await req.prisma.deck.findOne({
      where: { id }
    })

    if (!deck || !adminOrUserId(req, deck.userId)) {
      throw createError(404)
    }

    const updatedDeck = await req.prisma.deck.update({
      where: { id },
      data: {
        name: req.body.name
      }
    })
    
    res.json({
      data: updatedDeck
    })
  })
]

export const deleteDeck = wrapAsync(async function deleteDeck(req: Request, res: Response) {
  const { id } = req.params

  const deck = await req.prisma.deck.findOne({
    where: { id }
  })

  if (!deck || !adminOrUserId(req, deck.userId)) {
    throw createError(404)
  }

  await req.prisma.deck.delete({
    where: { id }
  })

  res.json({
    data: {}
  })
})
