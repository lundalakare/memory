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
    login () {
      const returnTo = app.context.route && app.context.route.path
        ? app.context.route.path
        : null

      window.location.href = `/api/login?back=${encodeURIComponent(returnTo)}`
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
