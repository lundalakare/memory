<template>
  <div class="container">
    <h3>{{ $auth.user.nickname }}</h3>

    <p>{{ $auth.user.email }}</p>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data: () => ({
    username: 'johndoe',
    email: 'john.doe@example.com'
  })
}
</script>

<style>

</style>
