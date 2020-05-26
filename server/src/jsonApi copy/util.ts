import express from 'express'
import jsonApi from 'ts-json-api'

/**
 * Sends a JSON:API response. Adds extra information such as JSON:API header to
 * the respone.
 * @param data The JSON:API Response to send
 */
export function send (res: express.Response, status: number, data: jsonApi.Response) {
  res
    .writeHead(status, {
      'Content-Type': 'application/vnd.api+json'
    })
    .end(JSON.stringify(data))
}

/**
 * Joins a set of path parts to a single URL path
 * @param parts Parts to join
 */
export function joinUrlPath(...parts: string[]) {
  const path = parts
    .join('/')
    .replace(/\/\/+/g, '/')
    .replace(/(?:^\/|\/$)/g, '')

  return `/${path}`
}
