export interface Template {
  id: string
  name: string
  description: string
  icon: string
  content: any
}

export const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start with a clean slate',
    icon: '📄',
    content: {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    },
  },
  {
    id: 'journal',
    name: 'Journal',
    description: 'Daily journal entry template',
    icon: '📔',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Journal Entry' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Date: ' }],
        },
        {
          type: 'paragraph',
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Today I...' }],
        },
        {
          type: 'paragraph',
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Reflections' }],
        },
        {
          type: 'paragraph',
        },
      ],
    },
  },
  {
    id: 'letter',
    name: 'Letter',
    description: 'Formal or personal letter template',
    icon: '✉️',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Dear ' }],
        },
        {
          type: 'paragraph',
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'I hope this letter finds you well. ',
            },
          ],
        },
        {
          type: 'paragraph',
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Sincerely,' }],
        },
        {
          type: 'paragraph',
        },
        {
          type: 'paragraph',
        },
      ],
    },
  },
  {
    id: 'poetry',
    name: 'Poetry',
    description: 'Poetry writing template',
    icon: '📝',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Untitled' }],
        },
        {
          type: 'paragraph',
        },
        {
          type: 'paragraph',
        },
        {
          type: 'paragraph',
        },
      ],
    },
  },
  {
    id: 'story',
    name: 'Story',
    description: 'Short story or novel template',
    icon: '📚',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Chapter 1' }],
        },
        {
          type: 'paragraph',
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'It was a dark and stormy night...',
            },
          ],
        },
        {
          type: 'paragraph',
        },
      ],
    },
  },
]

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}

