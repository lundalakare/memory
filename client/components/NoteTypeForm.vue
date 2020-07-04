<template>
  <div class="note-type-form">
    <div class="form-group">
      <label for="name">Name</label>

      <input id="name" v-model="noteType.name" type="text" class="form-control" placeholder="Note Type Name">
    </div>

    <div class="fields mb-3">
      <h4>Fields</h4>

      <div v-for="(field, i) of noteType.fields" :key="i" class="input-group">
        <input v-model="field.name" type="text" class="form-control" :placeholder="`Field ${i + 1}`">

        <div class="input-group-append">
          <button class="btn btn-outline-secondary" :disabled="i === 0" @click="changeFieldIndex(field, -1)">
            <b-icon-caret-up />
          </button>

          <button class="btn btn-outline-secondary" :disabled="i === noteType.fields.length - 1" @click="changeFieldIndex(field, 1)">
            <b-icon-caret-down />
          </button>

          <button class="btn btn-outline-secondary" @click="deleteField(field)">
            <b-icon-trash />
          </button>
        </div>
      </div>

      <button class="btn btn-outline-secondary" @click="addField">
        Add field
      </button>
    </div>

    <div class="templates mb-3">
      <h4>Templates</h4>

      <div v-for="(template, i) of noteType.templates" :key="i" class="card template mb-3">
        <div class="card-body">
          <div class="heading">
            <div class="name">
              <p><strong>{{ templateName(template) }}</strong></p>
            </div>

            <div>
              <button class="btn btn-outline-secondary" @click="deleteTemplate(template)">
                <b-icon-trash />
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="front">Front</label>

            <textarea id="front" v-model="template.front" class="form-control" rows="5" />
          </div>

          <div class="form-group">
            <label for="back">Back</label>

            <textarea id="back" v-model="template.back" class="form-control" rows="5" />
          </div>
        </div>
      </div>

      <button class="btn btn-outline-secondary" @click="addTemplate">
        Add template
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    noteType: {
      type: Object,
      default: () => ({
        name: '',
        fields: [],
        templates: []
      })
    }
  },
  methods: {
    addField () {
      this.noteType.fields.push({
        name: ''
      })
    },
    deleteField (field) {
      const index = this.noteType.fields.indexOf(field)
      this.noteType.fields.splice(index, 1)
    },
    changeFieldIndex (field, change) {
      const index = this.noteType.fields.indexOf(field)
      this.noteType.fields.splice(index + change, 0, this.noteType.fields.splice(index, 1)[0])
    },
    addTemplate () {
      this.noteType.templates.push({
        name: '',
        front: '',
        back: ''
      })
    },
    templateName (template) {
      const index = this.noteType.templates.indexOf(template)
      const re = new RegExp('{{(.*?)}}', 'gm')

      const frontFields = [...template.front.matchAll(re)]
        .map(match => match[1])
        .filter(field => this.noteType.fields.map(field => field.name).includes(field))

      const backFields = [...template.back.matchAll(re)]
        .map(match => match[1])
        .filter(field => this.noteType.fields.map(field => field.name).includes(field))

      if (frontFields.length > 0 && backFields.length > 0) {
        return `Card ${index + 1}: ${frontFields.join(' + ')} → ${backFields.join(' + ')}`
      }

      return `Card ${index + 1}`
    },
    deleteTemplate (template) {
      const index = this.noteType.templates.indexOf(template)
      this.noteType.templates.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.fields {
  .input-group {
    margin-bottom: 0.5em;
  }
}

.template {
  .heading {
    display: flex;

    .name {
      flex-grow: 1;
    }
  }

  .form-group:last-of-type {
    margin-bottom: 0;
  }
}
</style>
