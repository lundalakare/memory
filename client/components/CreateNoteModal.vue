<template>
  <b-modal id="create-note-modal" v-model="show" title="Add Note">
    <div class="form-group">
      <v-select v-model="selectedNoteType" :options="noteTypes" label="name" placeholder="Note Type" />
    </div>

    <div v-if="selectedNoteType">
      <div v-for="(name, i) in selectedNoteType.fields" :key="i" class="form-group">
        <label>{{ name }}</label>

        <textarea v-model="note.fields[name]" class="form-control" rows="5" />
      </div>
    </div>

    <template v-slot:modal-footer="{ cancel }">
      <button class="btn btn-outline-secondary" @click="cancel">
        Cancel
      </button>

      <button class="btn btn-primary" @click="create">
        Add
      </button>
    </template>
  </b-modal>
</template>

<script>
export default {
  data: () => ({
    show: false,
    noteTypes: [
      {
        name: 'Basic',
        fields: ['Front', 'Back']
      },
      {
        name: 'Basic (and reversed)',
        fields: ['Front', 'Back']
      }
    ],
    selectedNoteType: null,
    note: {
      fields: {}
    }
  }),
  methods: {
    create () {
      const note = {}

      this.$emit('created', note)

      this.show = false
    }
  }
}
</script>

<style>

</style>
