<template>
  <b-navbar toggleable="lg" variant="light" type="light" fixed="top">
    <b-navbar-brand to="/">
      Memory
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="$auth.user">
        <b-nav-item to="/decks">
          Decks
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown v-if="$auth.user" right>
          <template v-slot:button-content>
            {{ $auth.user.name }}
          </template>

          <b-dropdown-item to="/profile">
            Profile
          </b-dropdown-item>

          <b-dropdown-item :to="{ name: 'note-types' }">
            Note Types
          </b-dropdown-item>

          <b-dropdown-item @click="$auth.logout">
            Log Out
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item v-else @click="$auth.login">
          Log In
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.nav-link.nuxt-link-exact-active {
  color: rgba(0, 0, 0, 0.9) !important;
}
</style>
