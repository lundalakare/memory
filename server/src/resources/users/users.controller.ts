// import { Request, Response } from 'express'
// import Joi from '@hapi/joi'

// import {
//   ContainerTypes,
//   ValidatedRequest,
//   ValidatedRequestSchema,
//   createValidator
// } from 'express-joi-validation'

// const validator = createValidator({
//   passError: true
// })

// interface CreateUserSchema extends ValidatedRequestSchema {
//   [ContainerTypes.Body]: {
//     email: string;
//     username: string;
//     password: string;
//   };
// }
// export const createUser = [
//   validator.body(Joi.object({
//     email: Joi.string().email().required(),
//     username: Joi.string().min(3).required(),
//     password: Joi.string().required()
//   })),
//   async function createUser(req: ValidatedRequest<CreateUserSchema>, res: Response) {
//     const { email, password, username } = req.body
  
//     const user = await req.prisma.user.create({
//       data: {
//         email,
//         password,
//         username
//       }
//     })
  
//     res.json({
//       data: user
//     })
//   }
// ]

// export async function getUsers(req: Request, res: Response) {
//   const users = await req.prisma.user.findMany({
//     include: {
//       decks: true,
//       noteTypes: true
//     }
//   })

//   res.json({
//     data: users
//   })
// }

// export async function deleteUser(req: Request, res: Response) {
//   const { id } = req.params

//   const user = await req.prisma.user.delete({
//     where: {
//       id: id
//     }
//   })

//   res.json({
//     data: user
//   })
// }
