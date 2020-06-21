<template>
  <div class="container">
    <div class="row mb-2">
      <div v-if="!editing" class="col">
        <h3 class="mb-0">
          {{ name }}
          <button class="btn btn-link" @click="editing = true">
            <b-icon-pencil />
          </button>
        </h3>
      </div>

      <div v-else class="col">
        <div class="input-group">
          <input v-model="name" type="text" class="form-control" placeholder="Deck Name">

          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="editing = false">
              <b-icon-check />
            </button>
          </div>
        </div>
      </div>

      <div class="col actions">
        <nuxt-link to="/study" class="btn btn-primary float-right">
          Study
        </nuxt-link>

        <button v-b-modal.create-note-modal class="btn btn-outline-primary float-right">
          Create Note
        </button>
      </div>
    </div>

    <CreateNoteModal @created="createCards($event)" />
    <EditNoteModal v-if="selectedNote" :note="selectedNote" />

    <b-table
      :fields="fields"
      :items="cards"
      hover
      borderless
    >
      <template v-slot:cell(ordinal)="data">
        Card {{ data.value + 1 }}
      </template>

      <template v-slot:cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
import CreateNoteModal from '~/components/CreateNoteModal'
import EditNoteModal from '~/components/EditNoteModal'

export default {
  components: {
    CreateNoteModal,
    EditNoteModal
  },
  data: () => ({
    name: 'Patogenes',
    editing: false,
    fields: [
      { key: 'frontSide', label: 'Preview', sortable: true },
      { key: 'due', sortable: true }
    ],
    notes: [
      {
        id: 'o829ejnejkdnas',
        fields: {
          Front: 'Bonjour',
          Back: 'Hello'
        },
        type: {
          fields: ['Front', 'Back'],
          templates: [
            {
              id: '2784rhjwdfas',
              name: 'Front -> Back',
              frontSide: '{{Front}}',
              backSide: '{{FrontSide}}<hr>{{Back}}'
            },
            {
              id: 'r9i0wfjwnlks',
              name: 'Back -> Front',
              frontSide: '{{Back}}',
              backSide: '{{FrontSide}}<hr>{{Front}}'
            }
          ]
        },
        cards: [
          {
            templateId: '2784rhjwdfas',
            due: '2020-06-25'
          },
          {
            templateId: 'r9i0wfjwnlks',
            due: '2020-06-25'
          }
        ]
      }
    ],
    cards: [],
    selectedNote: null
  }),
  created () {
    const cards = this.notes.map((note) => {
      return note.cards.map((card) => {
        const template = note.type.templates.find(x => x.id === card.templateId)

        return {
          noteId: note.id,
          due: card.due,
          frontSide: this.replace(template.frontSide, note.fields),
          backSide: this.replace(template.backSide, note.fields)
        }
      })
    })
    this.cards = cards.flat()
  },
  methods: {
    onRowSelected (items) {
      this.selectedNote = this.notes.find(x => x.id === items[0].noteId)
      this.$bvModal.show('edit-note-modal')
    },
    replace (template, fields) {
      for (const field in fields) {
        template = template.replace(new RegExp(`{{${field}}}`, 'g'), fields[field])
      }
      return template
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
  .btn {
    margin-left: 0.5em;
  }
}
</style>
