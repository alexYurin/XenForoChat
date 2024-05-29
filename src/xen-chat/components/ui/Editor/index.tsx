import {
  CSSProperties,
  KeyboardEventHandler,
  RefObject,
  useEffect,
} from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import MenuBar from './MenuBar'

import './styles.scss'

const extensions = [
  Color,
  TextStyle,
  StarterKit,
  Placeholder.configure({
    placeholder: 'Type here...',
  }),
]

export type EditorProps = {
  inputMode: 'default' | 'reply' | 'edit'
  content: string
  refObject?: RefObject<HTMLDivElement> | null | undefined
  disabled?: boolean
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
  onChange: (html: string) => void
  style?: CSSProperties
}

const Editor = ({
  inputMode,
  content,
  refObject,
  disabled,
  onKeyDown,
  onChange,
  style,
}: EditorProps) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate(props) {
      onChange(props.editor.getHTML())
    },
  })

  const onEditorKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.code === 'Enter' && !event.shiftKey) {
      editor?.commands.clearContent(true)
      editor?.commands.focus('end')
    }

    if (typeof onKeyDown === 'function') {
      onKeyDown(event)
    }
  }

  useEffect(() => {
    if (inputMode === 'edit' && content) {
      editor?.commands.setContent(content)
    }

    if (inputMode === 'default' && !content) {
      editor?.commands.clearContent(true)
    }

    if (content === '<p></p>') {
      editor?.commands.clearContent(true)
    }
  }, [inputMode, content])

  useEffect(() => {
    if (editor) {
      editor.commands.focus('end')
    }
  }, [editor])

  return (
    <>
      <BubbleMenu editor={editor}>
        {editor && <MenuBar editor={editor} />}
      </BubbleMenu>
      <EditorContent
        ref={refObject}
        editor={editor}
        onKeyDown={onEditorKeyDown}
        style={style}
        placeholder="Type here..."
        disabled={disabled}
      />
    </>
  )
}

export default Editor
