<template>
  <div class="container">
    <h3>{{ $auth.user.name }}</h3>

    <p>{{ $auth.user.email }}</p>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  head: {
    title: 'Profile'
  }
}
</script>

<style>

</style>
