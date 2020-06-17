<template>
  <b-modal id="create-note-modal" v-model="show" title="Add Note">
    <div class="form-group">
      <v-select v-model="selectedNoteType" :options="noteTypes" label="name" placeholder="Note Type" />
    </div>

    <editor-menu-bar v-slot="{ isActive, commands }" :editor="editor">
      <div class="editor-menu-bar">
        <button class="btn btn-sm btn-light" :class="{ 'btn-dark': isActive.bold() }" @click="commands.bold">
          <b-icon-type-bold />
        </button>

        <button class="btn btn-sm btn-light" :class="{ 'btn-dark': isActive.italic() }" @click="commands.italic">
          <b-icon-type-italic />
        </button>
      </div>
    </editor-menu-bar>

    <div>
      <label>Front</label>
      <editor-content :editor="editor" />
    </div>

    <div v-if="selectedNoteType">
      <div v-for="(name, i) in selectedNoteType.fields" :key="i" class="form-group">
        <label>{{ name }}</label>

        <textarea v-model="note.fields[name]" class="form-control" rows="5" />
      </div>
    </div>

    <template v-slot:modal-footer="{ cancel }">
      <button class="btn btn-outline-secondary" @click="cancel">
        Cancel
      </button>

      <button class="btn btn-primary" @click="create">
        Add
      </button>
    </template>
  </b-modal>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Bold,
  Italic
} from 'tiptap-extensions'

export default {
  components: {
    EditorMenuBar,
    EditorContent
  },
  data: () => ({
    show: false,
    editor: null,
    noteTypes: [
      {
        name: 'Basic',
        fields: ['Front', 'Back']
      },
      {
        name: 'Basic (and reversed)',
        fields: ['Front', 'Back']
      }
    ],
    selectedNoteType: null,
    note: {
      fields: {}
    }
  }),
  mounted () {
    this.editor = new Editor({
      content: '<p>This is just a <strong>boring</strong> paragraph</p>',
      extensions: [
        new Bold(),
        new Italic()
      ]
    })
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    create () {
      const note = {}

      this.$emit('created', note)

      this.show = false
    }
  }
}
</script>

<style lang="scss">
.editor-menu-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5em;

  .btn {
    margin-left: 0.25em;
  }
}

.ProseMirror {
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out
}

.ProseMirror:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}
</style>
