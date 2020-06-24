<template>
  <div class="container">
    <div v-if="deck" class="row mb-2">
      <div v-if="!editing" class="col">
        <h3 class="mb-0">
          {{ deck.name }}
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

    <CreateNoteModal :note-types="noteTypes" @created="deck.notes.push($event)" />
    <EditNoteModal v-if="selectedNote" :note="selectedNote" />

    <b-table
      v-if="cards.length > 0"
      :fields="fields"
      :items="cards"
      hover
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
    deck: null,
    editing: false,
    fields: [
      { key: 'frontSide', label: 'Preview', sortable: true },
      { key: 'due', sortable: true }
    ],
    noteTypes: [],
    cards: [],
    selectedNote: null
  }),
  async created () {
    try {
      const id = this.$route.params.id

      this.deck = await this.$api.get(`/decks/${id}`)
      this.noteTypes = await this.$api.get('/note-types')
    } catch (error) {
      this.error = error
    }

    // const cards = this.notes.map((note) => {
    //   return note.cards.map((card) => {
    //     const template = note.type.templates.find(x => x.id === card.templateId)

    //     return {
    //       noteId: note.id,
    //       due: card.due,
    //       frontSide: this.replace(template.frontSide, note.fields),
    //       backSide: this.replace(template.backSide, note.fields)
    //     }
    //   })
    // })
    // this.cards = cards.flat()

    this.loaded = true
  },
  methods: {
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
