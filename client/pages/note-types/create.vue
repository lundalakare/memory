<template>
  <div class="container">
    <h4>Create Note Type</h4>

    <div class="form-group">
      <label for="name">Name</label>

      <input id="name" v-model="name" type="text" class="form-control">
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col">
            <h5>Fields ({{ fields.length }})</h5>
          </div>

          <div class="col">
            <div class="input-group">
              <input v-model="newFieldName" type="text" class="form-control" placeholder="Field Name">

              <div class="input-group-append">
                <button class="btn btn-outline-primary" type="button" :disabled="!newFieldName" @click="addField">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <b-table :fields="tableFields" :items="fields" hover>
          <template v-slot:cell(index)="data">
            {{ data.index }}
          </template>

          <template v-slot:cell(actions)="data">
            <button class="btn btn-link btn-sm" @click="deleteField(data.index)">
              <b-icon-trash />
            </button>

            <button v-if="data.index > 0" class="btn btn-link btn-sm" @click="decrementIndex(data.index)">
              <b-icon-caret-up />
            </button>
          </template>
        </b-table>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col">
            <h5>Card Types ({{ cardTypes.length }})</h5>
          </div>

          <div class="col">
            <button v-b-modal.create-card-type-modal class="btn btn-outline-primary float-right">
              Create
            </button>
          </div>
        </div>

        <CreateCardTypeModal @created="cardTypes.push($event)" />

        <div class="d-flex">
          <div class="form-group flex-grow-1">
            <v-select v-model="selectedCardType" :options="cardTypes" label="name" placeholder="Card Type" />
          </div>

          <div v-if="selectedCardType">
            <button class="btn btn-link" @click="deleteSelectedCardType">
              <b-icon-trash />
            </button>
          </div>
        </div>

        <div v-if="selectedCardType" class="row">
          <div class="col">
            <div class="form-group">
              <label for="name">Name</label>

              <input id="name" v-model="selectedCardType.name" type="text" class="form-control">
            </div>

            <div class="form-group">
              <label for="front-side">Front Side</label>

              <textarea id="front-side" v-model="selectedCardType.frontSide" class="form-control" rows="5" />
            </div>

            <div class="form-group">
              <label for="back-side">Back Side</label>

              <textarea id="back-side" v-model="selectedCardType.backSide" class="form-control" rows="5" />
            </div>
          </div>

          <div id="preview" class="col">
            <label>Preview (click to flip)</label>

            <div class="card" @click="previewFrontSide = !previewFrontSide">
              <div v-if="previewFrontSide">
                <div class="card-header">
                  Front Side
                </div>

                <div class="card-body" v-html="selectedCardType.frontSide" />
              </div>

              <div v-else>
                <div class="card-header">
                  Back Side
                </div>

                <div class="card-body" v-html="selectedCardType.backSide" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-success">
      Create Note Type
    </button>
  </div>
</template>

<script>
import CreateCardTypeModal from '~/components/CreateCardTypeModal'

export default {
  components: {
    CreateCardTypeModal
  },
  data: () => ({
    name: '',
    tableFields: [
      'index',
      'name',
      { key: 'actions', label: '' }
    ],
    fields: [
      {
        name: 'Front'
      },
      {
        name: 'Back'
      }
    ],
    newFieldName: '',
    cardTypes: [
      {
        name: 'Front -> Back',
        frontSide: '{{Front}}',
        backSide: '{{FrontSide}}<hr>{{Back}}'
      },
      {
        name: 'Back -> Front',
        frontSide: '{{Back}}',
        backSide: '{{FrontSide}}<hr>{{Front}}'
      }
    ],
    selectedCardType: null,
    previewFrontSide: true
  }),
  methods: {
    addField () {
      this.fields.push({
        name: this.newFieldName
      })

      this.newFieldName = ''
    },
    deleteField (index) {
      this.fields.splice(index, 1)
    },
    decrementIndex (index) {
      this.fields.splice(index - 1, 0, this.fields.splice(index, 1)[0])
    },
    deleteSelectedCardType () {
      const index = this.cardTypes.indexOf(this.selectedCardType)
      this.cardTypes.splice(index, 1)
      this.selectedCardType = null
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  .btn-sm {
    padding: 0;
  }
}

#preview {
  .card {
    margin-bottom: 1em;
    cursor: pointer;
  }
}
</style>
