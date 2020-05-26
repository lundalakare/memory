import { Request, Response, RequestHandler, NextFunction } from 'express'

export function wrapAsync(callback: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(callback(req, res, next)).catch(next)
  }
}

/**
 * Checks that all provided environment variables are present. If they're not an
 * error is logged and the process is stopped.
 * @param requiredVars
 */
export function checkEnv(requiredVars: string[]) {
  const missingEnvVars = []
  for (const name of requiredVars) {
    if (!process.env[name]) {
      missingEnvVars.push(name)
    }
  }
  if (missingEnvVars.length > 0) {
    console.error(`Missing required env vars: ${missingEnvVars.join(', ')}`)
    process.exit(1)
  }
}