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

interface CreateNoteTypeSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    fields: string[];
  };
}
export const createNoteType = [
  validator.body(Joi.object({
    name: Joi.string().required(),
    fields: Joi.array().items(Joi.string())
  })),
  wrapAsync(async function createNoteType(req: ValidatedRequest<CreateNoteTypeSchema>, res: Response) {
    const { name, fields } = req.body

    const noteType = await req.prisma.noteType.create({
      data: {
        name,
        fields: fields ? { set: fields } : undefined,
        user: { connect: { id: req.user.id } }
      }
    })

    res.json({
      data: noteType
    })
  })
]

export const getNoteTypes = wrapAsync(async function getNoteTypes(req: Request, res: Response) {
  const noteTypes = await req.prisma.noteType.findMany({
    where: {
      userId: skipIfAdmin(req, req.user.id)
    }
  })

  res.json({
    data: noteTypes
  })
})
