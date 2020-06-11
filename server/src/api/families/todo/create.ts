import Joi from '@hapi/joi'
import express from 'express'

import { ApiResponse } from '../../response'

export const scopes = ['todo:create']

export const method = 'post'

export const validate = {
  body: Joi.object({
    content: Joi.string()
      .required()
  })
}

export async function handle (req: express.Request): Promise<ApiResponse> {
  return new ApiResponse({
    foo: 'bar'
  })
}
