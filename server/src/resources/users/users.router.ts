import express from 'express'
import { getMe } from './users.controller'
import { requiresAuth as auth } from 'express-openid-connect'

const router = express.Router()

router.get('/me', auth(), getMe)

export { router }

