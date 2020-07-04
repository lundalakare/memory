import express from 'express'
import { createNoteType, getNoteTypes, getNoteType } from './noteTypes.controller'

const router = express.Router()

router.post('/', createNoteType)
router.get('/', getNoteTypes)

router.get('/:id', getNoteType)

export { router }
