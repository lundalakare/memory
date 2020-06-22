import express from 'express'
import { createDeck, getDecks, updateDeck, deleteDeck } from './decks.controller'

const router = express.Router()

router.post('/', createDeck)
router.get('/', getDecks)
router.put('/:id', updateDeck)
router.delete('/:id', deleteDeck)

export { router }
