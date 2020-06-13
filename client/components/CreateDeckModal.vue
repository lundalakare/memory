<template>
  <b-modal id="create-deck-modal" v-model="show" title="Create Deck">
    <div class="form-group">
      <label for="name">Name</label>

      <input id="name" v-model="name" type="text" class="form-control">
    </div>

    <template v-slot:modal-footer="{ cancel }">
      <button class="btn btn-outline-secondary" @click="cancel">
        Cancel
      </button>

      <button class="btn btn-primary" :disabled="!name" @click="create">
        Create
      </button>
    </template>
  </b-modal>
</template>

<script>
export default {
  data: () => ({
    show: false,
    name: ''
  }),
  methods: {
    create () {
      const deck = {
        name: this.name
      }

      this.$emit('created', deck)

      this.show = false
      this.name = ''
    }
  }
}
</script>

<style>

</style>
