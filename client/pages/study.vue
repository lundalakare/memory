<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <div v-if="!exposed">
          {{ card.front }}
        </div>

        <div v-else>
          {{ card.back }}
        </div>
      </div>
    </div>

    <div class="actions">
      <div v-if="!exposed">
        <button class="btn btn-primary" @click="exposed = true">
          Show Answer
        </button>
      </div>

      <div v-else>
        <button class="btn btn-outline-danger">
          Again
        </button>

        <button class="btn btn-outline-secondary">
          Hard
        </button>

        <button class="btn btn-primary">
          Good
        </button>

        <button class="btn btn-outline-success">
          Easy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    cards: [
      {
        front: 'NT-proBNP används vid diagnostik av [...].',
        back: 'NT-proBNP används vid diagnostik av hjärtsvikt.'
      },
      {
        front: '[...] används vid diagnostik av hjärtsvikt.',
        back: 'NT-proBNP används vid diagnostik av hjärtsvikt.'
      }
    ],
    index: 0,
    exposed: false
  }),
  computed: {
    card () {
      return this.cards[this.index]
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  font-size: 1.25em;
  margin-bottom: 1em;

  .card-body {
    display: flex;
    justify-content: center;
  }
}

.actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  padding: 1em 0;

  .btn {
    min-width: 100px;
    margin: 0 0.25em;
  }
}
</style>
