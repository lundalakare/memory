import { Request, Response } from 'express'
import Joi from '@hapi/joi'

import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator
} from 'express-joi-validation'
import wrapAsync from '~/util/wrapAsync'
import { adminOrUserId, skipIfAdmin } from '~/util/authorization'
import createError from 'http-errors'

const validator = createValidator({
  passError: true
})

interface FieldData {
  fieldName: string;
  value: string;
}
interface CreateNoteSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    noteTypeId: string;
    fieldData: FieldData[];
  };
}
export const createNote = [
  validator.body(Joi.object({
    noteTypeId: Joi.string().required(),
    fieldData: Joi.array().items(Joi.object({
      fieldName: Joi.string().required(),
      value: Joi.string().required()
    })).required()
  })),
  wrapAsync(async function createNote(req: ValidatedRequest<CreateNoteSchema>, res: Response) {
    const { noteTypeId, fieldData } = req.body

    const deck = await req.prisma.deck.findOne({
      where: { id: req.params.id }
    })
    if (!deck || !adminOrUserId(req, deck.userId)) {
      throw createError(404, 'Deck not found')
    }
    
    const noteType = await req.prisma.noteType.findOne({
      where: { id: noteTypeId }
    })
    if (!noteType || !adminOrUserId(req, noteType.userId)) {
      throw createError(404, 'Note type not found')
    }

    const note = await req.prisma.note.create({
      data: {
        type: { connect: { id: noteTypeId } },
        deck: { connect: { id: req.params.id } },
        fieldData: { create: fieldData }
      },
      include: {
        type: {
          include: {
            fields: true,
            templates: true
          }
        },
        fieldData: true,
        cards: true
      }
    })

    // Create cards too

    res.json({
      data: note
    })
  })
]

export const getNotes = wrapAsync(async function getNotes(req: Request, res: Response) {
  const notes = await req.prisma.note.findMany({
    where: {
      deck: {
        userId: skipIfAdmin(req, req.user.id)
      }
    },
    include: {
      fieldData: true
    }
  })

  res.json({
    data: notes
  })
})
