import express from 'express'
import { getUsers, createUser } from './users.controller'
import { requiresAuth } from 'express-openid-connect'

const router = express.Router()

router.get('/', requiresAuth(), getUsers)
router.post('/', createUser)

export { router }
