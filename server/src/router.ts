import express from 'express'
import { router as usersRouter } from './resources/users/users.router'

const router = express.Router()

router.use('/users', usersRouter)

export { router }
