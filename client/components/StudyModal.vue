<template>
  <b-modal id="study-modal" v-model="show" title="Study">
    <b-progress class="mb-2" show-value>
      <b-progress-bar :value="cards.new / total * 100" :label="cards.new" variant="primary" />
      <b-progress-bar :value="cards.learning / total * 100" :label="cards.learning" variant="danger" />
      <b-progress-bar :value="cards.reviewing / total * 100" :label="cards.reviewing" variant="success" />
    </b-progress>

    <p>Estimated time: 10 min</p>

    <template v-slot:modal-footer="{ cancel }">
      <button class="btn btn-outline-secondary" @click="cancel">
        Cancel
      </button>

      <nuxt-link to="/study" class="btn btn-primary">
        Start
      </nuxt-link>
    </template>
  </b-modal>
</template>

<script>
export default {
  data: () => ({
    show: false,
    cards: {
      new: 3,
      learning: 1,
      reviewing: 12
    }
  }),
  computed: {
    total () {
      return this.cards.new + this.cards.learning + this.cards.reviewing
    }
  }
}
</script>

<style>
.progress {
  height: 2em;
}
</style>
