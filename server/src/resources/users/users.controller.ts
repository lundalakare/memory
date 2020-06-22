import { Request, Response } from 'express'
import Joi from '@hapi/joi'

import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator
} from 'express-joi-validation'

const validator = createValidator({
  passError: true
})

export async function getUsers(req: Request, res: Response) {
  const users = await req.prisma.user.findMany()

  res.json({
    data: users
  })
}

interface CreateUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
  };
}
export const createUser = [
  validator.body(Joi.object({
    email: Joi.string().email().required()
  })),
  function createUser (req: ValidatedRequest<CreateUserSchema>, res: Response) {
    res.send({
      data: {
        foo: req.body.email
      }
    })
  }
]
