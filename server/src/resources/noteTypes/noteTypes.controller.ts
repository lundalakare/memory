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

interface Field {
  name: string;
  index: number;
}
interface Template {
  name: string;
  front: string;
  back: string;
}

interface CreateNoteTypeSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    fields: Field[];
    templates: Template[];
  };
}
export const createNoteType = [
  validator.body(Joi.object({
    name: Joi.string().required(),
    fields: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      index: Joi.number().required()
    })).required(),
    templates: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      front: Joi.string().required(),
      back: Joi.string().required()
    })).required()
  })),
  wrapAsync(async function createNoteType(req: ValidatedRequest<CreateNoteTypeSchema>, res: Response) {
    const { name, fields, templates } = req.body

    const noteType = await req.prisma.noteType.create({
      data: {
        name,
        fields: { create: fields },
        templates: { create: templates },
        user: { connect: { id: req.user.id } }
      }
    })

    res.json({
      data: noteType
    })
  })
]

export const getNoteTypes = [wrapAsync(async function getNoteTypes(req: Request, res: Response) {
  const noteTypes = await req.prisma.noteType.findMany({
    where: {
      userId: skipIfAdmin(req, req.user.id)
    },
    include: {
      fields: true,
      templates: true
    }
  })

  res.json({
    data: noteTypes
  })
})]

export const getNoteType = wrapAsync(async function getNoteType(req: Request, res: Response) {
  const noteType = await req.prisma.noteType.findOne({
    where: {
      id: req.params.id
    },
    include: {
      fields: true,
      templates: true
    }
  })

  if (!noteType || !adminOrUserId(req, noteType.userId)) {
    throw createError(404)
  }

  res.json({
    data: noteType
  })
})

interface UpdateNoteTypeSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    fields: Field[];
    templates: Template[];
  };
}
export const updateNoteType = [
  validator.body(Joi.object({
    name: Joi.string().required(),
    fields: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      index: Joi.number().required()
    })).required(),
    templates: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      front: Joi.string().required(),
      back: Joi.string().required()
    })).required()
  })),
  wrapAsync(async function updateNoteType(req: ValidatedRequest<UpdateNoteTypeSchema>, res: Response) {
    const { id } = req.params
    const { name, fields, templates } = req.body

    const noteType = await req.prisma.noteType.findOne({
      where: { id }
    })

    if (!noteType || !adminOrUserId(req, noteType.userId)) {
      throw createError(404)
    }

    // await req.prisma.field.updateMany({
    //   where: {
    //     noteTypeId: id
    //   },
    //   data: {
    //     fields: []
    //   }
    // })

    const updatedNoteType = await req.prisma.noteType.update({
      where: { id },
      data: {
        name
      }
    })

    res.json({
      data: updatedNoteType
    })
  })
]

export const deleteNoteType = [wrapAsync(async function deleteNoteType(req: Request, res: Response) {
  const { id } = req.body

  // Check if user is owner

  const noteType = await req.prisma.noteType.delete({
    where: {
      id
    }
  })

  res.json({
    data: noteType
  })
})]
