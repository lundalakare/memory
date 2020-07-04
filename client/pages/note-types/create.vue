<template>
  <div class="container">
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <h3>Create Note Type</h3>

    <NoteTypeForm :note-type="noteType" />

    <hr>

    <div class="clearfix mb-3">
      <button class="btn btn-primary float-right" @click="create">
        Create Note Type
      </button>
    </div>
  </div>
</template>

<script>
import NoteTypeForm from '~/components/NoteTypeForm'

export default {
  components: {
    NoteTypeForm
  },
  data: () => ({
    noteType: {
      name: '',
      fields: [],
      templates: []
    },
    error: null
  }),
  methods: {
    templateName (template) {
      const index = this.noteType.templates.indexOf(template)
      const re = new RegExp('{{(.*?)}}', 'gm')

      const frontFields = []
      const backFields = []

      for (const match of template.front.matchAll(re)) {
        const field = match[1]
        if (this.noteType.fields.map(field => field.name).includes(field)) {
          frontFields.push(match[1])
        }
      }

      for (const match of template.back.matchAll(re)) {
        const field = match[1]
        if (this.noteType.fields.map(field => field.name).includes(field)) {
          backFields.push(match[1])
        }
      }

      if (frontFields.length > 0 && backFields.length > 0) {
        return `Card ${index + 1}: ${frontFields.join(' + ')} → ${backFields.join(' + ')}`
      }

      return `Card ${index + 1}`
    },
    async create () {
      this.error = null

      try {
        const noteType = {
          name: this.noteType.name,
          fields: this.noteType.fields.map((field, i) => ({
            index: i,
            name: field.name
          })),
          templates: this.noteType.templates.map(template => ({
            name: this.templateName(template),
            front: template.front,
            back: template.back
          }))
        }

        await this.$api.post('/note-types', noteType)

        this.$router.push({ name: 'note-types' })
      } catch (error) {
        this.error = error
      }
    }
  }
}
</script>

<style>

</style>
