import { Request, Response } from 'express'
import createError from 'http-errors'
import wrapAsync from '~/util/wrapAsync'
import { OpenIDUserFiltered } from '~/OpenIDUser'

export const getMe = wrapAsync(async function getMe(req: Request, res: Response) {
  if (req.user) {
    /* eslint-disable @typescript-eslint/camelcase */
    const filteredUser: OpenIDUserFiltered = {
      id: req.user.id,
      email: req.user.email,
      email_verified: req.user.email_verified,
      name: req.user.name,
      nickname: req.user.name,
      picture: req.user.picture,
      sub: req.user.sub,
      updated_at: req.user.updated_at
    }
    /* eslint-enable @typescript-eslint/camelcase */

    res
      .set('Cache-Control', 'no-store, no-cache, private')
      .json({
        data: filteredUser
      })
  } else {
    throw createError(401)
  }
})
