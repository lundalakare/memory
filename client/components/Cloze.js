import { Mark } from 'tiptap'
import { updateMark } from 'tiptap-commands'

export default class Cloze extends Mark {
  get name () {
    return 'cloze'
  }

  get defaultOptions () {
    return {
      ordinal: 1
    }
  }

  get schema () {
    return {
      attrs: {
        ordinal: {
          default: 1
        }
      },
      parseDOM: [
        {
          tag: 'span.cloze'
        }
      ],
      toDOM: mark => ['span', {
        class: 'cloze',
        src: mark.ordinal
      }, 0]
    }
  }

  commands ({ type }) {
    return attrs => updateMark(type, attrs)
  }
}
