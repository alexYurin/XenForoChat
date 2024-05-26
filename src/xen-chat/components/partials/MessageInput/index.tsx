import { KeyboardEventHandler, useState, useRef, useEffect } from 'react'
import { Editor, AttachmentFile } from '@app/components/ui'
import DisplayAttachments from './DisplayAttachmets'
import { Box, Button, Stack, SxProps, Typography } from '@mui/material'
import data from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/react'
import SendIcon from '@mui/icons-material/Send'
import { useChatStore } from '@app/store'
import { toBBCode } from '@app/helpers'

// @TODO Decompose
const MessageInput = () => {
  const currentRoom = useChatStore(state => state.currentRoom)

  const sendMessage = useChatStore(state => state.sendMessage)

  const replyMessage = useChatStore(state => state.replyMessage)

  const editMessage = useChatStore(state => state.editMessage)

  const inputMode = useChatStore(state => state.inputMode)

  const inputModeContent = useChatStore(state => state.inputModeContent)

  const setInputMode = useChatStore(state => state.setInputMode)

  const [content, setContent] = useState('')

  const [attachments, setAttachments] = useState<File[]>([])

  const [isVisibleEmoji, setVisibleEmoji] = useState(false)

  const [isLoading, setLoading] = useState(false)

  const editableRef = useRef<HTMLDivElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const isRoomLock = !currentRoom?.model.isOpenConversation

  const onChangeEditable = (html: string) => {
    setContent(html)
  }

  const onChangeAttachments = (files: FileList | null) => {
    if (files) {
      setAttachments([
        ...attachments,
        ...Array.from(files)
          .filter(
            file =>
              !attachments
                .map(attachment => attachment.name)
                .includes(file.name),
          )
          .map(file => {
            return file
          }),
      ])
    }
  }

  const onRemoveAttachment = (removeAttachment: File) => {
    setAttachments(
      attachments.filter(
        attachment => attachment.name !== removeAttachment.name,
      ),
    )
  }

  const onCloseAttachments = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = ''
    }

    setAttachments([])
    handleResetInputMode()
  }

  const afterSend = () => {
    setLoading(false)
    setContent('')
    setAttachments([])
  }

  const sendContent = () => {
    if (isRoomLock) {
      return
    }

    const convertedContent = toBBCode(content)

    if (currentRoom && !isLoading) {
      setLoading(true)

      if (inputMode === 'reply') {
        replyMessage(
          currentRoom?.model.id,
          inputModeContent!,
          convertedContent,
        ).finally(afterSend)

        return
      }

      if (inputMode === 'edit') {
        editMessage(inputModeContent!.id, convertedContent).finally(afterSend)

        return
      }

      sendMessage(currentRoom.model.id, convertedContent, attachments).finally(
        afterSend,
      )
    }
  }

  const handleResetInputMode = () => {
    setInputMode('default', null)
  }

  const toggleVisibleEmoji = () => {
    setVisibleEmoji(!isVisibleEmoji)
  }

  const onSelectEmoji = (props: { native: string }) => {
    setContent(content + props.native)
  }

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.code === 'Enter' && event.shiftKey) {
      return
    }
    if (event.code === 'Enter') {
      event.preventDefault()
      sendContent()
    }
  }

  const focusOnEditable = () => {
    const editable = editableRef.current?.firstElementChild as HTMLDivElement

    if (editable) {
      editable.focus()
    }
  }

  const sxButton: SxProps = {
    paddingX: 2,
    paddingY: '12px',
    minWidth: 'unset',
    borderRadius: '12px',
    borderWidth: 1,
    borderColor: 'transparent',
    '&:hover': {
      borderWidth: 1,
      borderColor: 'transparent',
    },
  }

  const sxIcon: SxProps = {
    width: 24,
    height: 24,
  }

  useEffect(() => {
    if (inputMode === 'edit') {
      setContent(inputModeContent!.textParsed)
    }

    focusOnEditable()
  }, [inputMode])

  const toolsTitle =
    inputMode === 'reply'
      ? `Reply to ${inputModeContent?.member.model.name}`
      : inputMode === 'edit'
      ? 'Edit'
      : undefined

  const isVisibleTools = attachments.length > 0 || inputMode !== 'default'

  return (
    <Stack sx={{ position: 'relative' }} onKeyDown={onKeyDown}>
      <DisplayAttachments
        isVisible={isVisibleTools}
        title={toolsTitle}
        isLoading={isLoading}
        files={attachments}
        onRemove={onRemoveAttachment}
        onCancel={onCloseAttachments}
      >
        {(inputMode === 'reply' || inputMode === 'edit') && (
          <Box
            sx={{
              height: 'auto',
              display: 'flex',
              flexFlow: 'row nowrap',
              m: 0,
              padding: 2,
              pb: 0,
              gap: 0.5,
              borderTop: '1px solid #eee',
              width: 'calc(100% - 24px)',
              wordBreak: 'break-word',
              overflow: 'hidden',
              zIndex: 2,

              '& blockquote': {
                display: 'flex',
                flexDirection: 'column',
                m: 0,
                p: 1.5,
                bgcolor: '#e8e8ec',
                width: '100%',
                overflow: 'hidden',
                borderLeft: '3px solid #b1b1b1c3',
              },

              '& img': {
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '60px',
                borderRadius: '12px',
              },
            }}
          >
            <Box display="flex" flexDirection="column" mr={1.5}>
              <Typography>
                <span
                  style={{ fontSize: 13 }}
                  dangerouslySetInnerHTML={{
                    __html: inputModeContent!.textParsed,
                  }}
                />
              </Typography>
            </Box>
          </Box>
        )}
      </DisplayAttachments>
      <Box
        component="form"
        onClick={focusOnEditable}
        sx={{
          display: 'flex',
          flexFlow: 'nowrap',
          position: 'relative',
          gap: 0.5,
          paddingX: 1,
          paddingY: 1,
          transition: 'background-color 0.2s linear',
          bgcolor: '#fff',
          cursor: isRoomLock || isLoading ? 'default' : 'text',
          zIndex: 2,
          '& .tiptap > p': {
            margin: 0,
          },
          '& .tiptap:focus-visible': {
            outline: 'none',
          },
          '& blockquote': {
            display: 'none',
          },
        }}
      >
        <AttachmentFile
          isVisible={inputMode === 'default'}
          refInput={inputFileRef}
          onChange={onChangeAttachments}
          disabled={isRoomLock || isLoading}
          sxIcon={sxIcon}
          sx={sxButton}
        />

        <Editor
          inputMode={inputMode}
          content={content}
          refObject={editableRef}
          onChange={onChangeEditable}
          disabled={isRoomLock || isLoading}
          style={{
            margin: '0 6px',
            padding: '12px 0',
            width: '100%',
            borderRadius: '12px',
            outline: 0,
            fontFamily: 'roboto',
            lineHeight: '22px',
            visibility: isRoomLock || isLoading ? 'hidden' : 'visible',
          }}
        />

        {/* <Button
          disabled={isLoading}
          variant={isVisibleEmoji ? 'contained' : 'outlined'}
          onClick={toggleVisibleEmoji}
          sx={sxButton}
        >
          <InsertEmoticonIcon sx={sxIcon} />
        </Button> */}
        <Button
          type="button"
          disabled={isLoading || isRoomLock}
          variant="outlined"
          sx={sxButton}
          onClick={sendContent}
        >
          <SendIcon sx={sxIcon} />
        </Button>
      </Box>
      {isVisibleEmoji && (
        <Box sx={{ position: 'absolute', right: 15, bottom: '100%', mb: 2 }}>
          <EmojiPicker data={data} onEmojiSelect={onSelectEmoji} />
        </Box>
      )}
    </Stack>
  )
}

export default MessageInput
