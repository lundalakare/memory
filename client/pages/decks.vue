<template>
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

    <b-table :fields="fields" :items="decks" hover borderless>
      <template v-slot:cell(name)="data">
        <nuxt-link :to="{ name: 'deck-id', params: { id: data.item.id } }">
          {{ data.value }}
        </nuxt-link>
      </template>
    </b-table>
  </div>
</template>

<script>
import CreateDeckModal from '~/components/CreateDeckModal'
import StudyModal from '~/components/StudyModal'

export default {
  components: {
    CreateDeckModal,
    StudyModal
  },
  data: () => ({
    fields: [
      { key: 'name', label: 'Deck', sortable: true },
      { key: 'due', sortable: true }
    ],
    decks: [
      {
        id: '1',
        name: 'French 101',
        due: 13
      },
      {
        id: '2',
        name: 'Mikrobiologi',
        due: 2
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
.actions {
  .btn {
    margin-left: 0.5em;
  }
}
</style>
