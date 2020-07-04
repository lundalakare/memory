<template>
  <BaseLoad :loaded="loaded">
    <div class="container">
      <div class="row mb-2">
        <div class="col">
          <div class="actions">
            <nuxt-link :to="{ name: 'note-types-create' }" class="btn btn-outline-primary">
              Create Note Type
            </nuxt-link>
          </div>
        </div>
      </div>

      <b-table v-if="noteTypes.length > 0" :fields="fields" :items="noteTypes" hover @row-clicked="navigate">
        <template v-slot:cell(fields)="data">
          {{ data.value.map(field => field.name).join(', ') }}
        </template>

        <template v-slot:cell(templates)="data">
          {{ data.value.length }}
        </template>
      </b-table>
    </div>
  </BaseLoad>
</template>

<script>
export default {
  data: () => ({
    loaded: false,
    noteTypes: [],
    fields: [
      'name',
      'fields',
      'templates'
    ]
  }),
  async created () {
    try {
      this.noteTypes = await this.$api.get('/note-types')
    } catch (error) {
      this.error = error
    }

    this.loaded = true
  },
  methods: {
    navigate (item, index, event) {
      this.$router.push({ name: 'note-types-id', params: { id: item.id } })
    }
  },
  head: {
    title: 'Note Types'
  }
}
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
