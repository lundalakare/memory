import express, { response } from 'express'
import createError from 'http-errors'
import jsonApi from 'ts-json-api'

import { send, joinUrlPath } from './util'
import { wrapAsync } from '../util'

export enum RelationshipType {
  ToOne,
  ToMany,
}

interface JsonApiDataSource {
  findOne(id: string): Promise<any>;
  findMany(): Promise<any[]>;
  findRelated(id: string, relationship: string): Promise<any|any[]>;
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
  basePath?: string;
}
const DEFAULT_BUILD_JSON_API_OPTIONS = {
  basePath: '',
}

enum PathPartType {
  Collection,
  Resource,
  RelationshipPrefix,
  Relationship,
  RelationshipObject
}
interface PathPart {
  type: PathPartType;
  content: string;
}

/**
 * Takes a path and parses it into its components.
 * @param path The path to parse. Example: `/users/1/relationships/decks`
 */
function parsePathParts (path: string, resources: { [key: string]: JsonApiResource }) {
  const parts = path.replace(/(?:^\/|\/$)/g, '').split('/')
  const parsedParts: PathPart[] = []

  let lastPartType: PathPartType = null

  for (let i = 0; i < parts.length; i++) {
    let currentPartType = null

    // If there is no previous part type, i.e. this is the first item, set the
    // type to Collection. The root item of a path must always be a collection.
    if (lastPartType === null) {
      currentPartType = PathPartType.Collection
    } else
    // If the previous part was a collection, this must be a resource.
    if (lastPartType === PathPartType.Collection) {
      currentPartType = PathPartType.Resource
    } else
    // If the previous part was a resource this must be either a relationship
    // prefix or a related collection.
    if (lastPartType === PathPartType.Resource) {
      // Figure out if it's a relationship prefix or a related collection/resource.
      if (parts[i] === 'relationships') {
        // If this is the last part, it's an invalid path. Relationship prefixes
        // must always be followed by a relationship.
        if (i === parts.length - 1) {
          const error = new Error('No relationship specified')
          error.name = 'PathError'
          throw error
        }
        
        currentPartType = PathPartType.RelationshipPrefix
      } else {
        currentPartType = PathPartType.RelationshipObject
      }
    } else
    // If the previous part was a relationship prefix, this must be a
    // relationship.
    if (lastPartType === PathPartType.RelationshipPrefix) {
      currentPartType = PathPartType.Relationship
    } else
    // If the previous was a relationship, this must be an invalid path.
    // Relationships can only exist at the end of a path.
    if (lastPartType === PathPartType.Relationship) {
      const error = new Error('Relationship must be the last part of the path')
      error.name = 'PathError'
      throw error
    }

    lastPartType = currentPartType

    parsedParts.push({
      type: currentPartType,
      content: parts[i]
    })
  }

  return parsedParts
}

function mapModelToResource(options: BuildJsonApiOptions, model: { [key: string]: any }, resource: JsonApiResource, resourceName: string) {
  const attributes: jsonApi.Attributes = {}
  const relationships: jsonApi.Relationships = {}

  for (const name of resource.attributes) {
    attributes[name] = model[name]
  }

  for (const name in resource.relationships) {
    relationships[name] = {
      links: {
        self: joinUrlPath(options.basePath, resourceName, model.id, 'relationships', name),
        related: joinUrlPath(options.basePath, resourceName, model.id, name)
      }
    }
  }
  
  const newResource: jsonApi.ResourceObject = {
    id: model.id,
    type: resourceName,
    links: {
      self: joinUrlPath(options.basePath, resourceName, model.id)
    },
    attributes,
    relationships
  }

  return newResource
}

async function getCollection (options: BuildJsonApiOptions, req: express.Request, resourceName: string) {
  const resourceDef = options.resources[resourceName]

  const models = await resourceDef.dataSource.findMany()

  const resources = models.map(model => mapModelToResource(options, model, resourceDef, resourceName))

  return resources
}

async function getResource (options: BuildJsonApiOptions, req: express.Request, resourceName: string, resourceId: string) {
  const resourceDef = options.resources[resourceName]

  const model = await resourceDef.dataSource.findOne(resourceId)

  if (model) {
    return mapModelToResource(options, model, resourceDef, resourceName)
  } else {
    return null
  }
}

async function getRelated (options: BuildJsonApiOptions, req: express.Request, resourceName: string, resourceId: string, relationshipName: string) {
  const resourceDef = options.resources[resourceName]
  const relationship = resourceDef.relationships[relationshipName]
  const relatedResourceDef = options.resources[relationship.related]

  const result = await resourceDef.dataSource.findRelated(resourceId, relationshipName)

  if (Array.isArray(result)) {
    const resources = result.map(model => mapModelToResource(options, model, relatedResourceDef, relationshipName))
  
    return resources
  } else {
    if (result) {
      return mapModelToResource(options, result, relatedResourceDef, relationshipName)
    } else {
      return null
    }
  }
}

export function buildJsonApi (options: BuildJsonApiOptions) {
  options = {
    ...DEFAULT_BUILD_JSON_API_OPTIONS,
    ...options
  }

  return wrapAsync(async (req: express.Request, res: express.Response) => {
    if (req.headers['content-type']) {
      if (!req.is('application/vnd.api+json')) {
        throw createError(415)
      }
      const mediaTypeParameters = req.headers['content-type'].split(';').slice(1)
      if (mediaTypeParameters.length > 0) {
        throw createError(406)
      }
    }

    let pathParts
    try {
      pathParts = parsePathParts(req.path, options.resources)
    } catch (e) {
      if (e.name === 'PathError') {
        throw createError(404, e.message)
      } else {
        throw e
      }
    }
    
    const rootResourceName = pathParts[0].content
    const rootResourceDef = options.resources[rootResourceName]
    
    if (!rootResourceDef) {
      throw createError(404, `No such resource '${rootResourceName}'`)
    }

    let data: jsonApi.ResourceObjectOrObjects = null
    // If the path is only one level deep this must be a collection
    if (pathParts.length === 1) {
      data = await getCollection(options, req, rootResourceName)
    } else
    // If the path is two levels deep this must be a resource
    if (pathParts.length === 2) {
      const rootResourceId = pathParts[1].content
      data = await getResource(options, req, rootResourceName, rootResourceId)

      if (!data) {
        throw createError(404, `No such resource '${rootResourceName}' with ID '${rootResourceId}'`)
      }
    } else
    // If the path is three levels deep this must be a relationship object
    if (pathParts.length === 3) {
      const relationshipName = pathParts[2].content
      
      const relationship = rootResourceDef.relationships[pathParts[2].content]
      
      if (!relationship) {
        throw createError(404, `No such relationship '${pathParts[2].content}'`)
      }

      data = await getRelated(options, req, rootResourceName, pathParts[1].content, relationshipName)
    }

    if (data) {
      send(res, 200, {
        data
      })
    } else {
      throw createError(500)
    }
  })
}
