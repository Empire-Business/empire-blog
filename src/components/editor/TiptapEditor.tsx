'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Undo,
  Redo,
} from 'lucide-react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function TiptapEditor({ content, onChange, placeholder }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[300px] p-4 focus:outline-none bg-slate-800 border border-slate-700 rounded-b-lg',
        placeholder: placeholder || 'Escreva seu conteúdo aqui...',
      },
    },
  })

  const setHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor?.chain().focus().toggleHeading({ level }).run()
    },
    [editor]
  )

  if (!editor) {
    return null
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-800 border-b border-slate-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('bold') ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('italic') ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('code') ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Código"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => setHeading(1)}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setHeading(2)}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setHeading(3)}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('bulletList') ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('orderedList') ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-slate-700 ${
            editor.isActive('blockquote') ? 'bg-slate-700 text-primary-400' : 'text-slate-400'
          }`}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-slate-700 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Desfazer"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-slate-700 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refazer"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
