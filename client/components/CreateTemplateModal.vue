<template>
  <b-modal id="create-template-modal" v-model="show" title="Create Template">
    <div class="form-group">
      <label for="name">Name</label>

      <input id="name" v-model="name" type="text" class="form-control">
    </div>

    <div class="form-group">
      <label for="front-side">Front Side</label>

      <textarea id="front-side" v-model="frontSide" class="form-control" rows="5" />
    </div>

    <div class="form-group">
      <label for="back-side">Back Side</label>

      <textarea id="back-side" v-model="backSide" class="form-control" rows="5" />
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
    name: '',
    frontSide: '',
    backSide: ''
  }),
  methods: {
    create () {
      const template = {
        name: this.name,
        frontSide: this.frontSide,
        backSide: this.backSide
      }

      this.$emit('created', template)

      this.show = false
      this.name = ''
      this.frontSide = ''
      this.backSide = ''
    }
  }
}
</script>

<style>

</style>
