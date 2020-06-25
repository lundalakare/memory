export default function ({ app, error, redirect }) {
  if (!app.$auth || !app.$auth.user) {
    error({
      authBlock: true
    })
  }
}
