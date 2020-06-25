import express from 'express'
import { router as usersRouter } from './resources/users/users.router'
import { router as decksRouter } from './resources/decks/decks.router'
import { router as noteTypesRouter } from './resources/note-types/note-types.router'
import { router as notesRouter } from './resources/notes/notes.router'

const router = express.Router()

router.use('/users', usersRouter)
router.use('/decks', decksRouter)
router.use('/note-types', noteTypesRouter)
router.use('/notes', notesRouter)

export { router }
