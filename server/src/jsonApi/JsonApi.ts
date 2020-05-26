import express from 'express'
import createError from 'http-errors'
import jsonApi from 'ts-json-api'

import { send, joinUrlPath } from './util'
import { wrapAsync } from '../util'

interface JsonApiOptions {
  basePath?: string;
}
const DEFAULT_BUILD_JSON_API_OPTIONS = {
  basePath: '',
}

interface DataSource {
  findOne(id: string): Promise<PrismaLike>;
  findMany(): Promise<PrismaLike[]>;
  findRelated(id: string, relationship: string): Promise<PrismaLike|PrismaLike[]>;
}

interface Relationship {
  resource: string;
}
interface ResourceRelationships {
  [key: string]: Relationship;
}

interface ResourceAttributes {
  [key: string]: {};
}

interface ResourceDefintion {
  name: string;
  attributes: ResourceAttributes;
  relationships: ResourceRelationships;
  dataSource: DataSource;
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

interface PrismaLike {
  id: string;
  // Until we implement all common properties of Prisma models we need to use any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class JsonApi {
  options: JsonApiOptions

  resources: ResourceDefintion[] = []
  resourceMap: { [key: string]: ResourceDefintion } = {}

  constructor (options: JsonApiOptions = {}) {
    this.options = {
      ...DEFAULT_BUILD_JSON_API_OPTIONS,
      ...options
    }
  }

  resource (resource: ResourceDefintion) {
    this.resources.push(resource)
    this.resourceMap[resource.name] = resource
  }

  /**
   * Takes a path and parses it into its components.
   * @param path The path to parse. Example: `/users/1/relationships/decks`
   */
  parsePathParts (path: string) {
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

  mapModelToResource(model: PrismaLike, resource: ResourceDefintion, resourceName: string) {
    const attributes: jsonApi.Attributes = {}
    const relationships: jsonApi.Relationships = {}

    for (const name in resource.attributes) {
      attributes[name] = model[name]
      console.log(model, name)
    }
  
    for (const name in resource.relationships) {
      relationships[name] = {
        links: {
          self: joinUrlPath(this.options.basePath, resourceName, model.id, 'relationships', name),
          related: joinUrlPath(this.options.basePath, resourceName, model.id, name)
        }
      }
    }
    
    const newResource: jsonApi.ResourceObject = {
      id: model.id,
      type: resourceName,
      links: {
        self: joinUrlPath(this.options.basePath, resourceName, model.id)
      },
      attributes,
      relationships
    }
  
    return newResource
  }

  async getCollection (resourceName: string) {
    const resourceDef = this.resourceMap[resourceName]
  
    const models = await resourceDef.dataSource.findMany()
  
    const resources = models.map(model => this.mapModelToResource(model, resourceDef, resourceName))
  
    return resources
  }
  
  async getResource (resourceName: string, resourceId: string) {
    const resourceDef = this.resourceMap[resourceName]
  
    const model = await resourceDef.dataSource.findOne(resourceId)
  
    if (model) {
      return this.mapModelToResource(model, resourceDef, resourceName)
    } else {
      return null
    }
  }
  
  async getRelated (resourceName: string, resourceId: string, relationshipName: string) {
    const resourceDef = this.resourceMap[resourceName]
    const relationship = resourceDef.relationships[relationshipName]
    const relatedResourceDef = this.resourceMap[relationship.resource]
  
    const result = await resourceDef.dataSource.findRelated(resourceId, relationshipName)
  
    if (Array.isArray(result)) {
      const resources = result.map(model => this.mapModelToResource(model, relatedResourceDef, relationshipName))
    
      return resources
    } else {
      if (result) {
        return this.mapModelToResource(result, relatedResourceDef, relationshipName)
      } else {
        return null
      }
    }
  }

  handler () {
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
        pathParts = this.parsePathParts(req.path)
      } catch (e) {
        if (e.name === 'PathError') {
          throw createError(404, e.message)
        } else {
          throw e
        }
      }
      
      const rootResourceName = pathParts[0].content
      const rootResourceDef = this.resourceMap[rootResourceName]
      
      if (!rootResourceDef) {
        throw createError(404, `No such resource '${rootResourceName}'`)
      }
  
      let data: jsonApi.ResourceObjectOrObjects = null
      // If the path is only one level deep this must be a collection
      if (pathParts.length === 1) {
        data = await this.getCollection(rootResourceName)
      } else
      // If the path is two levels deep this must be a resource
      if (pathParts.length === 2) {
        const rootResourceId = pathParts[1].content
        data = await this.getResource(rootResourceName, rootResourceId)
  
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
  
        data = await this.getRelated(rootResourceName, pathParts[1].content, relationshipName)
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
}