<template>
  <b-modal id="create-note-modal" v-model="show" title="Create Note">
    <div class="form-group">
      <v-select v-model="selectedNoteType" :options="noteTypes" label="name" placeholder="Note Type" />
    </div>

    <div v-if="selectedNoteType">
      <FieldEditor v-for="(name, i) in selectedNoteType.fields" :key="i" v-model="note.fields[name]" :title="name" />
    </div>

    <template v-slot:modal-footer="{ cancel }">
      <button class="btn btn-outline-secondary" @click="cancel">
        Cancel
      </button>

      <button class="btn btn-primary" @click="create">
        Create
      </button>
    </template>
  </b-modal>
</template>

<script>
import FieldEditor from '~/components/FieldEditor'

export default {
  components: {
    FieldEditor
  },
  props: {
    noteTypes: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    show: false,
    selectedNoteType: null,
    note: {
      fields: {}
    }
  }),
  methods: {
    create () {
      const note = this.note

      note.type = this.selectedNoteType

      this.$emit('created', note)

      this.show = false
    }
  }
}
</script>

<style lang="scss">
.field-editor {
  margin-bottom: 1em;
}
</style>
