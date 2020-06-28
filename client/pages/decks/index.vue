<template>
  <BaseLoad :loaded="loaded">
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

      <CreateDeckModal @created="decks.push($event)" />
      <StudyModal />

      <b-table :items="decks" :fields="fields" hover>
        <template v-slot:cell(name)="data">
          <nuxt-link :to="{ name: 'decks-id', params: { id: data.item.id } }">
            {{ data.value }}
          </nuxt-link>
        </template>
      </b-table>
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
