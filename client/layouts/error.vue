<template>
  <b-container>
    <div v-if="error.statusCode === 404">
      <h1>
        Page not found
      </h1>
      <nuxt-link to="/">
        Home page
      </nuxt-link>
    </div>
    <div v-else-if="error.authBlock">
      <h1>
        Hold up!
      </h1>
      <span>
        You need to be logged in to view this page
      </span>
      <div>
        <b-button
          variant="primary"
          @click="$auth.login"
        >
          Log in
        </b-button>
      </div>
    </div>
    <div v-else>
      <h1>
        An error occurred
      </h1>
      <nuxt-link to="/">
        Home page
      </nuxt-link>
    </div>
  </b-container>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>
