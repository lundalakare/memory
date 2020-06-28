/**
 * Default Nuxt plugin export
 */
export default async ({ app }, inject) => {
  // This is to stop errors in SSR
  if (!process.client) {
    return
  }

  const auth = {
    user: null,
    login ({ signup }) {
      const url = new URL('/api/login', window.location.href)

      if (app.context.route && app.context.route.path) {
        url.searchParams.set('back', app.context.route.path)
      }
      if (signup) {
        url.searchParams.set('signup', true)
      }

      window.location.href = url.href
    },
    logout () {
      window.location.href = '/api/logout'
    }
  }

  try {
    auth.user = await app.$api.get('/users/me')
  } catch (e) {
    if (!e.response || !e.response.status === 401) {
      throw e
    }
  }

  inject('auth', auth)
}
