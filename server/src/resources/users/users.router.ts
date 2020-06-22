import express from 'express'
import { getUsers } from './users.controller'
import { requiresAuth } from 'express-openid-connect'

const router = express.Router()

router.get('/', requiresAuth(), getUsers)

export { router }
