<template>
  <div v-if="loaded">
    <slot />

    <h1 v-if="!$slots.default">
      404 not found
    </h1>
  </div>

  <div v-else :class="$style.spinner">
    <Spinner />
  </div>
</template>

<script>
import Spinner from '~/components/Spinner'

export default {
  components: {
    Spinner
  },
  props: {
    loaded: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" module>
.spinner {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}
</style>
