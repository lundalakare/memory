<template>
  <div class="container">
    <div class="form-group">
      <label for="datepicker">dateLastReviewed</label>

      <b-form-datepicker id="datepicker" v-model="dateLastReviewed" />
    </div>

    <div class="form-group">
      <label for="repetitions">repetitions</label>

      <input id="repetitions" v-model.number="repetitions" min="0" type="number" class="form-control">
    </div>

    <div class="form-group">
      <label for="interval">interval</label>

      <input id="interval" v-model.number="interval" min="1" type="number" class="form-control">
    </div>

    <div class="form-group">
      <label for="easiness">easiness</label>

      <input
        id="easiness"
        v-model.number="easiness"
        type="number"
        min="1.3"
        max="3"
        step="0.1"
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
        max="5"
        step="1"
      />
    </div>

    <table class="table">
      <tr>
        <th>newEasiness</th>
        <td>{{ newEasiness }}</td>
      </tr>

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
    dateLastReviewed: '2020-06-19',
    repetitions: 0,
    interval: 1,
    easiness: 2.5,
    quality: 4
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
      if (this.repetitions === 0) {
        return 1
      } else if (this.repetitions === 1) {
        return 3
      }

      return this.interval * this.easiness
    },
    newEasiness () {
      const factor = 0.1 - (5 - this.quality) * (0.08 + (5 - this.quality) * 0.02)
      const easiness = this.easiness + factor

      if (easiness > 3) {
        return 3
      }

      if (easiness < 1.3) {
        return 1.3
      }

      return easiness
    }
  }
}
</script>

<style>

</style>
