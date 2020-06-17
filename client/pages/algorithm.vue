<template>
  <div class="container">
    <div class="form-group">
      <label for="datepicker">dateLastReviewed</label>

      <b-form-datepicker id="datepicker" v-model="dateLastReviewed" />
    </div>

    <div class="form-group">
      <label for="interval">interval</label>

      <input id="interval" v-model.number="interval" min="0" type="number" class="form-control">
    </div>

    <div class="form-group">
      <label for="difficulty">difficulty</label>

      <input
        id="difficulty"
        v-model.number="difficulty"
        type="number"
        min="0"
        max="1"
        class="form-control"
      >
    </div>

    <table class="table">
      <tr>
        <th>Days since review</th>
        <td>{{ daysSinceReview }} days</td>
      </tr>

      <tr>
        <th>percentOverdue</th>
        <td>{{ percentOverdue }}</td>
      </tr>
    </table>

    <div class="form-group">
      <label for="quality">quality: {{ quality }}</label>

      <b-form-input
        id="quality"
        v-model.number="quality"
        type="range"
        min="0"
        max="1"
        step="0.1"
      />
    </div>

    <table class="table">
      <tr>
        <th>newInterval</th>
        <td>{{ newInterval }}</td>
      </tr>

      <tr>
        <th>due</th>
        <td>{{ $moment().add(newInterval, 'days').format('dddd, D MMMM Y') }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data: () => ({
    dateLastReviewed: '2020-06-14',
    interval: 1,
    difficulty: 0.3,
    quality: 0.6
  }),
  computed: {
    daysSinceReview () {
      const difference = this.$moment().startOf('day').unix() - this.$moment(this.dateLastReviewed).unix()
      const days = Math.round(difference / 86400)
      return days
    },
    percentOverdue () {
      return this.daysSinceReview / this.interval
    },
    newInterval () {
      const difficulty = this.difficulty + this.percentOverdue * 1 / 17 * (8 - 9 * this.quality)
      const difficultyWeight = 3 - 1.7 * difficulty

      if (this.quality >= 0.6) { // If correct
        return this.interval * 1 + (difficultyWeight - 1) * this.percentOverdue
      } else {
        return this.interval * 1 / difficultyWeight ** 2
      }
    }
  }
}
</script>

<style>

</style>
