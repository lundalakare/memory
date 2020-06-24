import express from 'express'
import { createDeck, getDecks, getDeck, updateDeck, deleteDeck } from './decks.controller'

const router = express.Router()

router.post('/', createDeck)
router.get('/', getDecks)
router.get('/:id', getDeck)
router.put('/:id', updateDeck)
router.delete('/:id', deleteDeck)

export { router }
