<template>
  <b-modal id="create-note-modal" v-model="show" title="Create Note">
    <div class="form-group">
      <v-select v-model="note.type" :options="noteTypes" label="name" placeholder="Note Type" />
    </div>

    <div v-if="note.type">
      <div v-for="(field, i) in note.type.fields" :key="i">
        <FieldEditor v-model="fields[field.name]" :title="field.name" />
      </div>
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
      type: Array,
      required: true
    }
  },
  data: () => ({
    show: false,
    note: {
      type: null
    },
    fields: {}
  }),
  methods: {
    create () {
      const note = this.note

      note.fieldData = []
      for (const key in this.fields) {
        note.fieldData.push({ fieldName: key, value: this.fields[key] })
      }

      this.$emit('created', note)
    }
  }
}
</script>

<style>
.field-editor {
  margin-bottom: 1em;
}
</style>
