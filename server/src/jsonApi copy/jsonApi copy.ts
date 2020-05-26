import express, { response } from 'express'
import createError from 'http-errors'
import jsonApi from 'ts-json-api'
import { PrismaClient, Role } from '@prisma/client'

import { send } from './util'
import { wrapAsync } from '../util'

export enum RelationshipType {
  ToOne,
  ToMany,
}

interface JsonApiDataSource {
  findOne(id: string): Promise<any>;
  findMany(): Promise<any[]>;
}

interface JsonApiRelationship {
  type: RelationshipType;
  related: string;
}

interface JsonApiResource {
  attributes: string[];
  relationships: { [key: string]: JsonApiRelationship };
  dataSource: JsonApiDataSource;
}

interface BuildJsonApiOptions {
  resources: { [key: string]: JsonApiResource };
  maxUrlDepth?: number;
  basePath?: string;
}
const DEFAULT_BUILD_JSON_API_OPTIONS = {
  maxUrlDepth: 2,
  basePath: '',
}

enum PathPartType {
  Collection,
  Resource,
  RelationshipPrefix,
  Relationship,
}
interface PathPart {
  type: PathPartType;
  content: string;
}

interface User extends jsonApi.ResourceObject {
  username: string;
  email: string;
  role: Role;
}

function parsePathParts (path: string) {
  const parts = path.replace(/(?:^\/|\/$)/g, '').split('/')
  const parsedParts: PathPart[] = []

  let lastPartType: PathPartType = null

  for (let i = 0; i < parts.length; i++) {
    let currentPartType = null

    if (lastPartType === null) {
      currentPartType = PathPartType.Collection
    } else
    if (lastPartType === PathPartType.Collection) {
      currentPartType = PathPartType.Resource
    } else
    if (lastPartType === PathPartType.Resource) {
      if (parts[i] === 'relationships') {
        currentPartType = PathPartType.RelationshipPrefix
      } else {
        currentPartType = PathPartType.Collection
      }
    } else
    if (lastPartType === PathPartType.RelationshipPrefix) {
      currentPartType = PathPartType.Relationship
    } else
    if (lastPartType === PathPartType.Relationship) {
      return null
    }

    lastPartType = currentPartType

    parsedParts.push({
      type: currentPartType,
      content: parts[i]
    })
  }

  return parsedParts
}

function mapModelToResource(options: BuildJsonApiOptions, model: { [key: string]: any }, resource: JsonApiResource, resourceName: string, currentPath: string) {
  const attributes: jsonApi.Attributes = {}
  const relationships: jsonApi.Relationships = {}

  for (const name of resource.attributes) {
    attributes[name] = model[name]
  }

  for (const name in resource.relationships) {
    relationships[name] = {
      links: {
        self: [currentPath, model.id, 'relationships', name].join('/'),
        related: [options.basePath, resourceName, model.id, name].join('/')
      }
    }
  }
  
  const newResource: jsonApi.ResourceObject = {
    id: model.id,
    type: resourceName,
    links: {
      self: [currentPath, model.id].join('/')
    },
    attributes,
    relationships
  }

  return newResource
}

async function getCollection (options: BuildJsonApiOptions, req: express.Request, resourceName: string, currentPath: string) {
  const resourceDef = options.resources[resourceName]

  const models = await resourceDef.dataSource.findMany()

  const resources = models.map(model => mapModelToResource(options, model, resourceDef, resourceName, currentPath))

  return resources
}

async function getResource (options: BuildJsonApiOptions, req: express.Request, resourceName: string, resourceId: string, currentPath: string) {
  const resourceDef = options.resources[resourceName]

  const model = await resourceDef.dataSource.findOne(resourceId)

  if (model) {
    const resource = mapModelToResource(options, model, resourceDef, resourceName, currentPath)
  
    return resource
  } else {
    return null
  }
}

export function buildJsonApi (options: BuildJsonApiOptions) {
  options = {
    ...DEFAULT_BUILD_JSON_API_OPTIONS,
    ...options
  }

  return wrapAsync(async (req: express.Request, res: express.Response) => {
    const urlParts = req.path.substring(1).split('/')

    const parsedPathParts = parsePathParts(req.path)

    console.log(parsedPathParts.map(part => ({
      type: PathPartType[part.type],
      content: part.content
    })))

    let currentPartType: PathPartType = null

    let response: jsonApi.Response = null

    let resourceName: string = null
    let resource: JsonApiResource = null

    for (let i = 0; i < urlParts.length; i++) {
      const part = urlParts[i]
      const currentParts = urlParts.slice(0, i + 1)
      const currentPath = [options.basePath, ...currentParts].join('/')
      const remainingParts = urlParts.slice(i + 1)
      const isFinal = remainingParts.length === 0

      if (currentPartType === null) {
        currentPartType = PathPartType.Collection
      } else
      if (currentPartType === PathPartType.Collection) {
        currentPartType = PathPartType.Resource
      } else
      if (currentPartType === PathPartType.Resource) {
        if (part === 'relationships') {
          currentPartType = PathPartType.Relationship
        } else {
          currentPartType = PathPartType.Resource
        }
      }

      switch (currentPartType) {
        case PathPartType.Collection: {
          resourceName = part
          resource = options.resources[part]
      
          if (!resource) {
            throw createError(404, `No such resource '${part}'`)
          }

          if (isFinal) {
            const resources = await getCollection(options, req, part, currentPath)

            response = {
              data: resources
            }
          }
          break
        }
        case PathPartType.Resource: {
          if (isFinal) {
            const resource = await getResource(options, req, resourceName, part, currentPath)

            response = {
              data: resource
            }
          }
          break
        }
        case PathPartType.Relationship: {
          console.log('Relationship')
        }
      }
    }

    if (response) {
      send(res, response)
    } else {
      throw createError(500)
    }
  })
}
