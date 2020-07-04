<template>
  <BaseLoad :loaded="loaded">
    <CreateNoteModal :note-types="noteTypes" @created="createNote($event)" />
    <EditNoteModal v-if="selectedCard" :note="selectedCard.note" />

    <div v-if="deck" class="container">
      <div class="row mb-2">
        <div v-if="!editing" class="col">
          <h3 class="mb-0">
            {{ deck.name }}
          </h3>
        </div>

        <div v-else class="col">
          <div class="input-group">
            <input v-model="deck.name" type="text" class="form-control" placeholder="Deck Name">

            <div class="input-group-append">
              <button class="btn btn-outline-primary" type="button" @click="updateDeck">
                <b-icon-check />
              </button>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="actions">
            <button v-if="!editing" class="btn btn-link" @click="editing = true">
              <b-icon-pencil />
            </button>

            <button class="btn btn-link" @click="deleteDeck">
              <b-icon-trash />
            </button>

            <button v-b-modal.create-note-modal class="btn btn-outline-primary">
              Create Note
            </button>

            <nuxt-link to="/study" class="btn btn-primary">
              Study
            </nuxt-link>
          </div>
        </div>
      </div>

      <b-table
        v-if="cards.length > 0"
        :fields="fields"
        :items="cards"
        hover
        @row-clicked="editNote"
      />
    </div>
  </baseload>
</template></b-table>
    </div>
  </BaseLoad>
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
    loaded: false,
    deck: null,
    editing: false,
    fields: [
      { key: 'front', sortable: true },
      { key: 'back', sortable: true }
    ],
    noteTypes: [],
    selectedCard: null
  }),
  computed: {
    cards () {
      return this.deck.notes.flatMap(note => this.render(note))
    }
  },
  async created () {
    try {
      const id = this.$route.params.id

      this.deck = await this.$api.get(`/decks/${id}`)
      this.noteTypes = await this.$api.get('/note-types')
    } catch (error) {
      this.error = error
    }

    this.loaded = true
  },
  methods: {
    async updateDeck () {
      try {
        await this.$api.patch(`/decks/${this.deck.id}`, {
          name: this.deck.name
        })
      } catch (error) {
        this.error = error
      }

      this.editing = false
    },
    async deleteDeck () {
      if (confirm('Are you sure you want to delete this deck?')) {
        try {
          await this.$api.delete(`/decks/${this.deck.id}`)
        } catch (error) {
          this.error = error
        }

        this.$router.push({ name: 'decks' })
      }
    },
    async createNote (event) {
      try {
        const note = await this.$api.post(`/decks/${this.deck.id}/notes`, {
          noteTypeId: event.type.id,
          fieldData: event.fieldData
        })
        this.deck.notes.push(note)
      } catch (error) {
        this.error = error
      }
    },
    editNote (item, index, event) {
      this.selectedCard = item
      this.$bvModal.show('edit-note-modal')
    },
    render (note) {
      const re = new RegExp('{{(.*?)}}', 'gm')
      return note.type.templates.map((template) => {
        const card = {
          note
        }
        card.front = template.front.replace(re, (match, field) => {
          return note.fieldData.find(x => x.fieldName === field).value
        })
        card.back = template.back.replace(re, (match, field) => {
          if (field === 'FrontSide') {
            return card.front
          }
          return note.fieldData.find(x => x.fieldName === field).value
        })
        return card
      })
    }
  },
  head () {
    return {
      title: this.deck ? this.deck.name : null
    }
  },
  middleware: ['auth']
}
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  justify-content: flex-end;

  .btn-primary, .btn-outline-primary {
    margin-left: 0.5em;
  }
}
</style>
