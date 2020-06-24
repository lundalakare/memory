import express from 'express'
import { createDeck, getDecks, updateDeck, deleteDeck } from './decks.controller'
import { requiresAuth as auth } from 'express-openid-connect'
import { scope } from '../../util/authorization'

const router = express.Router()

router.post('/', auth(), scope('decks:write'), createDeck)
router.get('/', auth(), scope('decks:read'), getDecks)
router.put('/:id', auth(), scope('decks:write'), updateDeck)
router.delete('/:id', auth(), scope('decks:write'), deleteDeck)

export { router }
