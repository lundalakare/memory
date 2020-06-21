<template>
  <div class="field-editor">
    <div class="header">
      <label>{{ title }}</label>

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
    </div>

    <editor-content class="editor-content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Bold,
  Italic,
  Image,
  Link,
  History
} from 'tiptap-extensions'

export default {
  components: {
    EditorMenuBar,
    EditorContent
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    editor: null
  }),
  mounted () {
    this.editor = new Editor({
      extensions: [
        new Bold(),
        new Italic(),
        new Image(),
        new Link(),
        new History()
      ],
      content: this.value,
      onUpdate: ({ getHTML }) => {
        const state = getHTML()
        this.$emit('input', state)
      }
    })
    this.editor.setContent(this.value)
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
.field-editor {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 0.5em;

    label {
      margin-bottom: 0;
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

  .editor-content {
    img {
      max-width: 100%;
    }
  }
}
</style>
