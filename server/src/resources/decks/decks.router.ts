import express from 'express'
import { requiresAuth as auth } from 'express-openid-connect'
import { scope } from '~/util/authorization'
import {
  getDecks,
  createDeck,
  getDeck,
  updateDeck,
  deleteDeck
} from './decks.controller'
import { createNote } from '../notes/notes.controller'

const router = express.Router()

router.get('/', auth(), scope('decks:read'), getDecks)
router.post('/', auth(), scope('decks:write'), createDeck)

router.get('/:id', auth(), scope('decks:read'), getDeck)
router.patch('/:id', auth(), scope('decks:write'), updateDeck)
router.delete('/:id', auth(), scope('decks:write'), deleteDeck)

router.post('/:id/notes', auth(), scope('decks:write'), createNote)

export { router }
