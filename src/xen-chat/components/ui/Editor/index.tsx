import {
  CSSProperties,
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useState,
} from 'react'
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  Editor as EditorInstance,
} from '@tiptap/react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatStrikethroughOutlinedIcon from '@mui/icons-material/FormatStrikethroughOutlined'

import './styles.scss'

const extensions = [Color, TextStyle, StarterKit]

type MenuBarProps = {
  editor: EditorInstance | null
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const [textFormats, setTextFormats] = useState<string[]>([])

  const handleTextFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setTextFormats(newFormats)
  }

  if (!editor) {
    return null
  }

  return (
    <ToggleButtonGroup
      value={textFormats}
      onChange={handleTextFormat}
      aria-label="text formatting"
      sx={{
        bgcolor: '#fff',
      }}
    >
      <ToggleButton
        value="bold"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton
        value="italic"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton
        value="strike"
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <FormatStrikethroughOutlinedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

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
      editor?.commands.setContent('')
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
      editor?.commands.setContent('')
    }
  }, [inputMode, content])

  return (
    <>
      <BubbleMenu editor={editor}>
        <MenuBar editor={editor} />
      </BubbleMenu>
      <EditorContent
        ref={refObject}
        editor={editor}
        onKeyDown={onEditorKeyDown}
        style={style}
        disabled={disabled}
      />
    </>
  )
}

export default Editor
