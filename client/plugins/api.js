/**
 * @file Adds `this.$api` to the Vue instance. Works like
 * `this.$axios`, but instead of returning a response object all request methods
 * return `response.data.data`.
 *
 * The following methods are modified: `get`, `delete`, `head`, `options`, `post`, `put`, `patch`
 */

/**
 * Custom ApiError class to add extra properties to the Error object.
 * Added properties:
 * - `code' - Contains the error code sent from the server.
 */
export class ApiError extends Error {
  constructor (message, code = null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

/**
 * Default Nuxt plugin export
 */
export default ({ app }, inject) => {
  /**
   * Returns a function that runs the Axios method `func` and returns `response.data.data`.
   *
   * @param {Function} func Original Axios method
   */
  function wrap (func) {
    return async function (...args) {
      const result = await func(...args)

      if (result && result.data) {
        if (result.data.error) {
          throw new ApiError(result.data.error.message, result.data.error.code)
        }
        if (result.data.data) {
          return result.data.data
        } else {
          return null
        }
      } else {
        throw new Error('Invalid Axios response. Expected response to contain data key.')
      }
    }
  }

  inject('api', {
    ...app.$axios,

    get: wrap(app.$axios.get),
    delete: wrap(app.$axios.delete),
    head: wrap(app.$axios.head),
    options: wrap(app.$axios.options),
    post: wrap(app.$axios.post),
    put: wrap(app.$axios.put),
    patch: wrap(app.$axios.patch)
  })
}
