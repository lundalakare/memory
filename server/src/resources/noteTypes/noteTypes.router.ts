import express from 'express'
import { createNoteType, getNoteTypes } from './noteTypes.controller'

const router = express.Router()

router.post('/', createNoteType)
router.get('/', getNoteTypes)

export { router }
