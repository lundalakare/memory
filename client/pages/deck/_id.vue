<template>
  <div class="container">
    <div class="row mb-2">
      <div v-if="!editingName" class="col">
        <h3 class="mb-0">
          {{ name }}
          <button class="btn btn-link" @click="editingName = true">
            <b-icon-pencil />
          </button>
        </h3>
      </div>

      <div v-else class="col">
        <div class="input-group">
          <input v-model="name" type="text" class="form-control" placeholder="Deck Name">

          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="editingName = false">
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
          Add Note
        </button>
      </div>
    </div>

    <CreateNoteModal />

    <b-table
      :fields="fields"
      :items="cards"
      hover
      borderless
      selectable
      select-mode="single"
      @row-selected="onRowSelected"
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

export default {
  components: {
    CreateNoteModal
  },
  data: () => ({
    name: 'Patogenes',
    editingName: false,
    fields: [
      { key: 'frontSide', label: 'Preview', sortable: true },
      { key: 'ordinal', label: 'Card', sortable: true },
      { key: 'due', sortable: true }
    ],
    cards: [
      {
        frontSide: 'NT-proBNP används vid diagnostik av [...].',
        backSide: 'NT-proBNP används vid diagnostik av hjärtsvikt.',
        ordinal: 0,
        due: '2020-07-10'
      },
      {
        frontSide: '[...] används vid diagnostik av hjärtsvikt.',
        backSide: 'NT-proBNP används vid diagnostik av hjärtsvikt.',
        ordinal: 1,
        due: '2020-07-11'
      }
    ]
  }),
  methods: {
    onRowSelected () {

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
