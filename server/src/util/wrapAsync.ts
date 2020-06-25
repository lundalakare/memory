import { Response, NextFunction } from 'express'
import { ValidatedRequest } from 'express-joi-validation'

export default function wrapAsync (
  fn: (
    req: ValidatedRequest<any>,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) {
  return (
    req: ValidatedRequest<any>,
    res: Response,
    next: NextFunction
  ) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
