<template>
  <div class="container">
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
export default {
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
  }),
  async mounted () {
    try {
      const currentUser = await this.$api.get('/test')

      console.log(currentUser)
    } catch (e) {
      console.log('Something went wrong:', e)
      console.log('Code:', e.code)
    }
  }
}
</script>

<style>
.container {
  padding-top: 1em;
}
</style>
