<template>
  <b-modal id="edit-note-modal" v-model="show" title="Edit Note">
    <div v-for="(field, i) in note.type.fields" :key="i">
      <FieldEditor v-model="fields[field.name]" :title="field.name" />
    </div>

    <template v-slot:modal-footer="{ cancel }">
      <button class="btn btn-outline-secondary" @click="cancel">
        Cancel
      </button>

      <button class="btn btn-primary" @click="update">
        Update
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
    note: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    show: false,
    fields: {}
  }),
  created () {
    this.note.fieldData.forEach((fieldData) => {
      this.fields[fieldData.fieldName] = fieldData.value
    })
  },
  methods: {
    update () {
      const note = this.note

      note.fieldData = []
      for (const key in this.fields) {
        note.fieldData.push({ fieldName: key, value: this.fields[key] })
      }

      this.$emit('updated', this.note)
    }
  }
}
</script>

<style>
.field-editor {
  margin-bottom: 1em;
}
</style>
