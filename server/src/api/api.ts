import path from 'path'
import { promises as fs} from 'fs'

import express from 'express'
import createError from 'http-errors'
import { describe } from './describe'

const FAMILIES_PATH = path.join(__dirname, './families')

type MethodModule = typeof import('./MethodModule')

async function loadMethod (path: string): Promise<MethodModule> {
  return import(path)
}

async function getDirFiles (dir: string) {
  const items = await fs.readdir(dir, {
    withFileTypes: true
  })

  const files: string[][] = []

  for (const item of items) {
    if (item.isDirectory()) {
      const subFiles = await getDirFiles(path.join(dir, item.name))
      for (const file of subFiles) {
        files.push([item.name, ...file])
      }
    } else
    if (item.name.endsWith('.ts')) {
      files.push([item.name])
    }
  }

  return files
}

async function getMethods () {
  const files = await getDirFiles(FAMILIES_PATH)

  const methods: Record<string, MethodModule> = {}

  for (const file of files) {
    const mod = await loadMethod(path.join(FAMILIES_PATH, ...file))

    const methodName = file.join('.').replace(/\.[^.]+$/, '')

    methods[methodName] = mod
  }

  return methods
}

export async function createApi () {
  const methods = await getMethods()

  const description = describe(methods)

  console.log(description)
  
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const method = methods[req.path.substring(1)]

    if (method) {
      if (req.method.toLowerCase() === method.method.toLowerCase()) {
        method.handle(req)
          .then((response) => {
            res
              .status(response.status)
              .json({
                data: response.data
              })
          })
          .catch(next)
      } else {
        res.set('Allow', method.method.toUpperCase())
        next(createError(405))
      }
    } else {
      next()
    }
  }
}
