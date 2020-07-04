<template>
  <div class="container">
    <div class="form-group">
      <label for="front-side">Front Template</label>

      <textarea id="front-side" v-model="frontTemplate" class="form-control" rows="5" />
    </div>

    <div class="form-group">
      <label for="back-side">Back Template</label>

      <textarea id="back-side" v-model="backTemplate" class="form-control" rows="5" />
    </div>

    <div v-for="(name, i) in fields" :key="i" class="form-group">
      <FieldEditor v-model="note.fields[name]" :title="name" />
    </div>

    <div class="card">
      <div class="card-body" style="border-bottom: 1px solid rgba(0, 0, 0, 0.125);" v-html="card.frontSide" />

      <div class="card-body" v-html="card.backSide" />
    </div>
  </div>
</template>

<script>
import FieldEditor from '~/components/FieldEditor'

export default {
  components: {
    FieldEditor
  },
  data: () => ({
    fields: ['Country', 'Capital'],
    frontTemplate: 'What is the capital city of {{Country}}?',
    backTemplate: '{{FrontSide}}<br>{{Capital}}',
    note: {
      fields: {}
    }
  }),
  computed: {
    card () {
      return {
        frontSide: this.render(this.frontTemplate, this.note),
        backSide: this.render(this.backTemplate, this.note)
      }
    }
  },
  methods: {
    render (template, note) {
      const re = new RegExp('{{(.*?)}}', 'gm')
      return template.replace(re, (match, field) => {
        if (field === 'FrontSide') {
          return this.render(this.frontTemplate, note)
        }
        return note.fields[field]
      })
    }
  }
}
</script>

<style lang="scss">
.card {
  .card-body {
    p {
      display: inline;
    }
  }
}
</style>
