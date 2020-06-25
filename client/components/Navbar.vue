<template>
  <b-navbar toggleable="lg" variant="light" type="light" fixed="top">
    <b-navbar-brand to="/">
      Memory
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/decks">
          Decks
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown
          v-if="$auth.user"
          right
        >
          <template v-slot:button-content>
            {{ $auth.user.nickname }}
          </template>

          <b-dropdown-item to="/profile">
            Profile
          </b-dropdown-item>

          <b-dropdown-item to="/note-types">
            Note Types
          </b-dropdown-item>

          <b-dropdown-item @click="$auth.logout">
            Log Out
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-button
          v-else
          size="sm"
          variant="primary"
          @click="$auth.login"
        >
          Log in
        </b-button>

        <!-- <b-nav-item-dropdown
          v-else
          right
        >
          <template v-slot:button-content>
            johndoe
          </template>

          <b-dropdown-item to="/profile">
            Profile
          </b-dropdown-item>

          <b-dropdown-item to="/note-types">
            Note Types
          </b-dropdown-item>

          <b-dropdown-item>
            Log Out
          </b-dropdown-item>
        </b-nav-item-dropdown> -->
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
