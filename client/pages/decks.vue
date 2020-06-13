<template>
  <div class="container">
    <div class="row">
      <div class="col actions">
        <button class="btn btn-primary float-right">
          Study
        </button>

        <button v-b-modal.create-deck-modal class="btn btn-outline-primary float-right">
          Create Deck
        </button>
      </div>
    </div>

    <CreateDeckModal @created="decks.push($event)" />

    <b-table :fields="fields" :items="decks" hover borderless>
      <template v-slot:cell(link)="data">
        <nuxt-link :to="{ name: 'deck-id', params: { id: data.item.id } }">
          {{ data.item.name }}
        </nuxt-link>
      </template>
    </b-table>
  </div>
</template>

<script>
import CreateDeckModal from '~/components/CreateDeckModal'

export default {
  components: {
    CreateDeckModal
  },
  data: () => ({
    fields: [
      { key: 'link', label: 'Name' },
      'due'
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
