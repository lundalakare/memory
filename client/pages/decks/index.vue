<template>
  <BaseLoad :loaded="loaded">
    <CreateDeckModal @created="createDeck($event)" />
    <StudyModal />

    <div class="container">
      <div class="row mb-2">
        <div class="col actions">
          <button v-b-modal.study-modal class="btn btn-primary float-right">
            Study
          </button>

          <button v-b-modal.create-deck-modal class="btn btn-outline-primary float-right">
            Create Deck
          </button>
        </div>
      </div>

      <b-table :items="decks" :fields="fields" hover @row-clicked="navigate" />
    </div>
  </BaseLoad>
</template>

<script>
import CreateDeckModal from '~/components/CreateDeckModal'
import StudyModal from '~/components/StudyModal'

export default {
  middleware: ['auth'],
  components: {
    CreateDeckModal,
    StudyModal
  },
  data: () => ({
    loaded: false,
    error: null,
    loading: false,
    decks: [],
    fields: [
      { key: 'name', label: 'Deck', sortable: true }
    ]
  }),
  async created () {
    try {
      this.decks = await this.$api.get('/decks')
    } catch (error) {
      this.error = error
    }

    this.loaded = true
  },
  methods: {
    async createDeck (data) {
      this.loading = true

      try {
        const deck = await this.$api.post('/decks', {
          name: data.name
        })

        this.decks.push(deck)
      } catch (error) {
        this.error = error
      }

      this.loading = false
    },
    navigate (item, index, event) {
      this.$router.push({ name: 'decks-id', params: { id: item.id } })
    }
  },
  head: {
    title: 'Decks'
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
