import Joi from '@hapi/joi'
import express from 'express'

import { ApiResponse } from './response'

export const scopes: string[] = null

export const method: 'get'|'post' = null

export const validate: {
  body?: Joi.ObjectSchema;
} = {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function handle (req: express.Request): Promise<ApiResponse> {
  return new ApiResponse({})
}
