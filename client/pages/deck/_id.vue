<template>
  <div class="container">
    <div class="row mb-2">
      <div class="col">
        <h3>{{ name }}</h3>
      </div>

      <div class="col actions">
        <nuxt-link to="/study" class="btn btn-primary float-right">
          Study
        </nuxt-link>

        <button class="btn btn-outline-secondary float-right">
          <b-icon-pencil />
        </button>
      </div>
    </div>

    <b-table :fields="fields" :items="cards" hover borderless>
      <template v-slot:cell(sortField)="data">
        {{ data.item.front }}
      </template>

      <template v-slot:cell(ordinal)="data">
        Cloze {{ data.value + 1 }}
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    name: 'Patogenes',
    fields: [
      'sortField',
      { key: 'ordinal', label: 'Card' },
      'due'
    ],
    cards: [
      {
        front: 'NT-proBNP används vid diagnostik av [...].',
        back: 'NT-proBNP används vid diagnostik av hjärtsvikt.',
        ordinal: 0,
        due: '2020-07-11'
      },
      {
        front: '[...] används vid diagnostik av hjärtsvikt.',
        back: 'NT-proBNP används vid diagnostik av hjärtsvikt.',
        ordinal: 1,
        due: '2020-07-11'
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
