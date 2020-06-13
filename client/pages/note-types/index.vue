<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <nuxt-link to="/note-types/create" class="btn btn-primary float-right">
          Create Note Type
        </nuxt-link>
      </div>
    </div>

    <b-table :fields="fields" :items="noteTypes" hover borderless>
      <template v-slot:cell(fields)="data">
        {{ data.value.join(', ') }}
      </template>

      <template v-slot:cell(cardTypes)="data">
        {{ data.value.length }}
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    fields: [
      'name',
      'fields',
      'cardTypes'
    ],
    noteTypes: [
      {
        name: 'Basic',
        fields: ['Front', 'Back'],
        cardTypes: [
          {
            front: '{{Front}}',
            back: '{{FrontSide}}<hr>{{Back}}'
          }
        ]
      },
      {
        name: 'Basic (and reversed)',
        fields: ['Front', 'Back'],
        cardTypes: [
          {
            front: '{{Front}}',
            back: '{{FrontSide}}<hr>{{Back}}'
          },
          {
            front: '{{Back}}',
            back: '{{FrontSide}}<hr>{{Front}}'
          }
        ]
      }
    ]
  })
}
</script>

<style>

</style>
