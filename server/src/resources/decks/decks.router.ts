import express from 'express'
import { createDeck, getDecks } from './decks.controller'

const router = express.Router()

router.post('/', createDeck)
router.get('/', getDecks)

export { router }
