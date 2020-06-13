<template>
  <b-navbar toggleable="lg" variant="light" type="light" fixed="top">
    <b-navbar-brand to="/">
      Memory
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/">
          Decks
        </b-nav-item>

        <b-nav-item to="/study">
          Study
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            User
          </template>

          <b-dropdown-item>
            Profile
          </b-dropdown-item>

          <b-dropdown-item>
            Log out
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {

}
</script>

<style>

</style>
