import express from 'express'
import { createUser, getUsers, deleteUser } from './users.controller'

const router = express.Router()

router.post('/', createUser)
router.get('/', getUsers)
router.delete('/:id', deleteUser)

export { router }
