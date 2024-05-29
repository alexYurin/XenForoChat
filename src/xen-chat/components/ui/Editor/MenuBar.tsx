import { useEffect, useState } from 'react'
import { Editor as EditorInstance } from '@tiptap/react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatStrikethroughOutlinedIcon from '@mui/icons-material/FormatStrikethroughOutlined'

type MenuBarProps = {
  editor: EditorInstance | null
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const [textFormats, setTextFormats] = useState<string[]>([])

  const isBold = editor?.isActive('bold')
  const isItalic = editor?.isActive('italic')
  const isStrike = editor?.isActive('strike')

  const handleTextFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setTextFormats(newFormats)
  }

  useEffect(() => {
    let formats: string[] = []

    if (isBold) {
      formats.push('bold')
    }

    if (isItalic) {
      formats.push('italic')
    }

    if (isStrike) {
      formats.push('strike')
    }

    setTextFormats(formats)
  }, [editor?.view.state.selection])

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

export default MenuBar
