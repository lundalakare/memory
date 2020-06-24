<template>
  <div v-if="loaded">
    <slot />

    <h1 v-if="!$slots.default">
      404 not found
    </h1>
  </div>

  <div v-else>
    Loading...
  </div>
</template>

<script>
export default {
  props: {
    loaded: {
      type: Boolean,
      default: false
    }
  }
}
</script>
