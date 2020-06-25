import { Request, Response, NextFunction } from 'express'

export function scope(scope: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user._scopes.includes(scope)) {
      return next()
    } else {
      res.status(403).send()
    }
  }
}

export function adminOrUserId (req: Request, userId: string) {
  return req.user._admin || req.user.id === userId
}

export function skipIfAdmin (req: Request, value: string) {
  if (req.user._admin) {
    return undefined
  } else {
    return value
  }
}
