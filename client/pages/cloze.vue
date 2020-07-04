<template>
  <div class="container">
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

    <editor-content class="editor-content" :editor="editor" />

    <pre>
{{ note }}
    </pre>

    <div v-if="cards.length">
      <div v-for="(card, i) in cards" :key="i">
        <div class="card">
          <div class="card-header">
            Cloze {{ i + 1 }}
          </div>
          <div class="card-body" v-html="card.frontSide" />
          <div class="card-body" v-html="card.backSide" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Bold,
  Italic,
  History
} from 'tiptap-extensions'

export default {
  components: {
    EditorMenuBar,
    EditorContent
  },
  data: () => ({
    editor: null,
    value: '{{c2::NT-proBNP}} används vid diagnostik av {{c1::hjärtsvikt}}.',
    note: ''
  }),
  computed: {
    clozes () {
      const re = new RegExp('{{c([0-9]+)::(.*?)(?:::(.*?))?}}', 'gm')
      return this.note.matchAll(re)
    },
    max () {
      const ordinals = [...this.clozes].map(cloze => parseInt(cloze[1]))
      return Math.max(...ordinals)
    },
    cards () {
      const cards = []

      for (let ord = 1; ord <= this.max; ord++) {
        cards.push({
          frontSide: this.clear(this.omit(ord)),
          backSide: this.clear(this.highlight(ord))
        })
      }

      return cards
    }
  },
  mounted () {
    this.editor = new Editor({
      extensions: [
        new Bold(),
        new Italic(),
        new History()
      ],
      content: this.value,
      onUpdate: ({ getJSON, getHTML }) => {
        this.note = getHTML()
      }
    })
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    omit (ordinal) {
      const re = new RegExp(`{{c${ordinal}::(.*?)(?:::(.*?))?}}`, 'gm')
      return this.note.replace(re, (match, cloze, hint) => {
        const replacement = hint ? `[${hint}]` : '[...]'
        return `<span class="cloze">${replacement}</span>`
      })
    },
    highlight (ordinal) {
      const re = new RegExp(`{{c${ordinal}::(.*?)(?:::(.*?))?}}`, 'gm')
      return this.note.replace(re, (match, cloze, hint) => {
        return `<span class="cloze">${cloze}</span>`
      })
    },
    clear (content) {
      const re = new RegExp('{{c[0-9]+::(.*?)(?:::.*?)?}}', 'gm')
      return content.replace(re, '$1')
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

.editor-content {
  margin-bottom: 2em;

  .cloze {
    color: blue;
  }
}

.card {
  margin-bottom: 2em;

  .cloze {
    font-weight: bold;
    color: blue;
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
