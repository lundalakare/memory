<template>
  <BaseLoad :loaded="loaded">
    <div class="container">
      <h3>Edit Note Type</h3>

      <NoteTypeForm :note-type="noteType" />

      <hr>

      <div class="clearfix mb-3">
        <button class="btn btn-primary float-right" @click="update">
          Update
        </button>
      </div>
    </div>
  </BaseLoad>
</template>

<script>
import NoteTypeForm from '~/components/NoteTypeForm'

export default {
  components: {
    NoteTypeForm
  },
  data: () => ({
    loaded: false,
    noteType: null
  }),
  async created () {
    try {
      const id = this.$route.params.id
      this.noteType = await this.$api.get(`/note-types/${id}`)
    } catch (error) {
      this.error = error
    }

    this.loaded = true
  },
  methods: {
    async update () {

    }
  }
}
</script>

<style>

</style>
