<template>
  <b-modal id="edit-note-modal" v-model="show" title="Edit Note">
    <div v-for="(name, i) in note.type.fields" :key="i">
      <FieldEditor v-model="note.fields[name]" :title="name" />
    </div>

    <template v-slot:modal-footer="{ cancel }">
      <button class="btn btn-outline-secondary" @click="cancel">
        Cancel
      </button>

      <button class="btn btn-primary" @click="show = false">
        Done
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
    show: false
  })
}
</script>

<style>

</style>
