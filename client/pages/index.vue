<template>
  <div class="container">
    <div id="hero" class="card">
      <div class="card-body">
        <h1 class="display-4">
          Hack your brain.
        </h1>

        <h3 class="mb-4">
          Learn more in less time. Never forget.
        </h3>

        <button class="btn btn-outline-light">
          Create account
        </button>
      </div>
    </div>

    <section class="explore">
      <h2>Explore</h2>

      <div class="decks">
        <div v-for="(deck, i) in decks" :key="i" class="card deck">
          <div class="card-body">
            <h5 class="card-title">
              {{ deck.name }}
            </h5>

            <p class="card-text">
              {{ deck.description }}
            </p>

            <button class="btn btn-primary">
              Clone
            </button>
          </div>
        </div>
      </div>
    </section>

    <p>Medlund Education AB</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    decks: [
      {
        name: 'French 101',
        description: 'Learn French by 101 of the most common french words.'
      },
      {
        name: 'Patogenes',
        description: 'High-Yield facts from the pathology course. Includes cardiovascular, nephrology, oncology, and neurology.'
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
#hero {
  border-color: #007bff;
  background-color: #007bff;
  color: white;
  margin-bottom: 1em;
}

.explore {
  margin-bottom: 1em;

  .decks {
    display: flex;
    justify-content: flex-start;

    .deck {
      position: relative;
      width: 25%;
      padding-bottom: calc(1.25em + 38px);
      margin-right: 1em;

      p {
        margin-bottom: 0;
      }

      .btn {
        position: absolute;
        bottom: 1.25em;
      }
    }
  }
}
</style>
