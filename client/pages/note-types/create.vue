<template>
  <div class="container">
    <h4>Create Note Type</h4>

    <div class="form-group">
      <label for="name">Name</label>

      <input id="name" v-model="name" type="text" class="form-control">
    </div>

    <div class="row mb-2">
      <div class="col">
        <h5>Fields</h5>
      </div>

      <div class="col">
        <button class="btn btn-primary float-right">
          Create
        </button>
      </div>
    </div>

    <b-table :fields="tableFields" :items="fields" hover>
      <template v-slot:cell(index)="data">
        {{ data.index }}
      </template>
    </b-table>

    <div class="row mb-2">
      <div class="col">
        <h5>Card Types</h5>
      </div>

      <div class="col">
        <button class="btn btn-primary float-right">
          Create
        </button>
      </div>
    </div>

    <div class="form-group">
      <v-select v-model="selectedCardType" :options="cardTypes" label="name" />
    </div>

    <div v-if="selectedCardType" class="form-group">
      <label for="front-side">Front Side</label>

      <textarea id="front-side" v-model="selectedCardType.frontSide" class="form-control" rows="5" />
    </div>

    <div v-if="selectedCardType" class="form-group">
      <label for="back-side">Back Side</label>

      <textarea id="back-side" v-model="selectedCardType.backSide" class="form-control" rows="5" />
    </div>

    <button class="btn btn-success">
      Create Note Type
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    name: '',
    tableFields: [
      'index',
      'name'
    ],
    fields: [
      {
        name: 'Front'
      },
      {
        name: 'Back'
      }
    ],
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
    selectedCardType: null
  })
}
</script>

<style lang="scss" scoped>
.card-types-selection {
  display: flex;

  .form-group {
    flex-grow: 1;
  }
}
</style>
