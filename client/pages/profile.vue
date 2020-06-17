<template>
  <div class="container">
    <h3>{{ username }}</h3>

    <p>{{ email }}</p>

    <p>
      <a href="#">Change password</a>
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    username: 'johndoe',
    email: 'john.doe@example.com'
  })
}
</script>

<style>

</style>
