<template>
  <div id="main">
    <Navbar />
    <nuxt />
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>

<style>
#main {
  padding-top: calc(56px + 1em);
  padding-bottom: 1em;
}
</style>
