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
        <div v-if="card.state == 1" class="rating">
          <div class="option">
            <div class="interval">
              {{ interval(0.5) }}
            </div>

            <div class="button">
              <button class="btn btn-danger" @click="next">
                Again
              </button>
            </div>
          </div>

          <div class="option">
            <div class="interval">
              {{ interval(0.8) }}
            </div>

            <div class="button">
              <button class="btn btn-secondary" @click="next">
                Hard
              </button>
            </div>
          </div>

          <div class="option">
            <div class="interval">
              {{ interval(1) }}
            </div>

            <div class="button">
              <button class="btn btn-primary" @click="next">
                Good
              </button>
            </div>
          </div>

          <div class="option">
            <div class="interval">
              {{ interval(1.3) }}
            </div>

            <div class="button">
              <button class="btn btn-success" @click="next">
                Easy
              </button>
            </div>
          </div>
        </div>

        <div v-else class="rating">
          <div class="option">
            <div class="interval">
              {{ interval(1) }}
            </div>

            <div class="button">
              <button class="btn btn-danger" @click="next">
                Again
              </button>
            </div>
          </div>

          <div class="option">
            <div class="interval">
              {{ interval(1) }}
            </div>

            <div class="button">
              <button class="btn btn-danger" @click="next">
                Good
              </button>
            </div>
          </div>

          <div class="option">
            <div class="interval">
              {{ interval(1) }}
            </div>

            <div class="button">
              <button class="btn btn-danger" @click="next">
                Easy
              </button>
            </div>
          </div>
        </div>
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
        back: 'NT-proBNP används vid diagnostik av hjärtsvikt.',
        factor: 2.5,
        interval: 86400,
        state: 1
      },
      {
        front: '[...] används vid diagnostik av hjärtsvikt.',
        back: 'NT-proBNP används vid diagnostik av hjärtsvikt.',
        factor: 2.5,
        interval: 86400,
        state: 0
      }
    ],
    index: 0,
    exposed: false
  }),
  computed: {
    card () {
      return this.cards[this.index]
    }
  },
  methods: {
    interval (ease) {
      const interval = this.card.interval * this.card.factor * ease
      return this.$moment.duration(interval, 's').humanize({ d: 30 })
    },
    next () {
      this.exposed = false

      if (this.index < this.cards.length - 1) {
        this.index++
      }
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

  .rating {
    display: flex;
    justify-content: space-between;

    .interval {
      text-align: center;
    }
  }

  .btn {
    min-width: 100px;
    margin: 0 0.25em;
  }
}
</style>
