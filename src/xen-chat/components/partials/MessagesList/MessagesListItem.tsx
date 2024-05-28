import { useState } from 'react'
import {
  ListItem,
  ListItemButton,
  Popover,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  styled,
} from '@mui/material'
import stc from 'string-to-color'
import { AvatarExt } from '@app/components/ui'
import ReactionPanel from './ReactionPanel'
import { dateFromNow, displayName, fromHTML, stringToColor } from '@app/helpers'
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'

import bbCodeParser from 'bbcode-to-react'
import { MessageModelType } from '@app/core/domain/Message'
import { useChatStore } from '@app/store'
import { XenChatMode } from '@app/enums'
import AttachmentPreview from './AttachmentPreview'

export type MessagesListItemProps = {
  detail: MessageModelType
}

// TODO Decompose

const MessagesListItem = ({ detail }: MessagesListItemProps) => {
  const mode = useChatStore(state => state.mode)

  const currentRoom = useChatStore(state => state.currentRoom)

  const setInputMode = useChatStore(state => state.setInputMode)

  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(
    null,
  )

  const handleClick: React.MouseEventHandler<HTMLDivElement> = event => {
    setAnchorElement(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElement(null)
  }

  const handleReply = () => {
    setInputMode('reply', detail)
  }

  const handleEdit = () => {
    setInputMode('edit', detail)
  }

  const isOpenTools = Boolean(anchorElement)

  const id = isOpenTools ? 'simple-popover' + detail.id : undefined

  const isRevert = detail.isAuthor

  const isRoomLock = !currentRoom?.model.isOpenConversation

  const containerStyles = isRevert
    ? {
        flexDirection: 'row-reverse',
        alignSelf: 'flex-end',
      }
    : {}

  const blockRadius = isRevert ? '16px 0 16px 16px' : '0 16px 16px 16px'

  const bgColor = isRevert ? '#f3f5f6' : '#f4f4f9'

  const html = detail.textParsed

  const replyAuthor = fromHTML(html)?.getAttribute('data-name')

  const StyledListItem = styled(ListItem)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      maxWidth: '90%',
    },
  }))

  const footer = (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      mt={0}
      gap={2}
      height={16}
    >
      {/*['😍', '😡'].map(react => `${react} `)*/} {/*reaction*/}
      <Typography
        display="flex"
        alignItems="center"
        ml="auto"
        gap={0.5}
        component="time"
        color="GrayText"
      >
        {dateFromNow(detail.createAt)}
        {
          isRevert && (
            <CheckOutlinedIcon />
          ) /* <DoneAllOutlinedIcon /> @TODO check is read */
        }
      </Typography>
    </Box>
  )

  return (
    <StyledListItem
      sx={{
        alignItems: 'flex-start',
        p: 1,
        gap: 1,
        maxWidth: mode === XenChatMode.POPUP ? '90%' : '60%',
        width: 'max-content',
        ...containerStyles,
        [`&:hover [id=message-box-${detail.id}]`]: {
          display: isRoomLock ? 'none' : 'flex',
        },
        borderRadius: '16px',
      }}
    >
      <a
        href={detail.member.model.link}
        target="_blank"
        style={{ textDecoration: 'none' }}
      >
        <AvatarExt
          src={detail.member.model.avatar}
          avatarText={detail.member.model.title || detail.member.model.name}
          isOnline={isRevert}
          sx={{ p: 0 }}
        />
      </a>
      <Box
        display="flex"
        flexDirection="column"
        position="relative"
        sx={{
          overflowWrap: 'break-word',
          maxWidth: '90%',
        }}
      >
        <Box
          id={`message-box-${detail.id}`}
          display="none"
          flexDirection="column"
          gap={0.5}
          sx={{
            position: 'absolute',
            top: '16px',
            ...(isRevert
              ? { left: 0, ml: -4.5, pr: 2.8 }
              : { right: 0, mr: -4.5, pl: 2.8 }),
            height: '100%',
            zIndex: 2,
          }}
        >
          <IconButton color="primary" onClick={handleReply}>
            <ReplyOutlinedIcon
              sx={{ transform: `scaleX(${isRevert ? '-' : ''}1)` }}
            />
          </IconButton>
          {detail.isAuthor && detail.permissions.isCanEdit && (
            <IconButton color="primary" onClick={handleEdit}>
              <EditNoteOutlinedIcon />
            </IconButton>
          )}
        </Box>
        <Typography
          mb={0.2}
          alignSelf={isRevert ? 'flex-end' : 'flex-start'}
          fontSize={14}
          component="a"
          href={detail.member.model.link}
          target="_blank"
          fontWeight={500}
          color={stc(
            displayName(detail.member.model.name, detail.member.model.title),
          )}
          sx={{
            overflowWrap: 'break-word',
            textDecoration: 'none',
            maxWidth: '100%',
          }}
        >
          {detail.member.model.title || detail.member.model.name}
        </Typography>

        {detail.attachments.length > 0 && (
          <Box
            display="flex"
            sx={{ flexFlow: 'row wrap', mb: 1, gap: 1, width: '100%' }}
          >
            {detail.attachments.map(attachment => (
              <AttachmentPreview
                key={attachment.model.id}
                detail={attachment}
              />
            ))}
          </Box>
        )}

        <ListItemButton
          aria-describedby={id}
          onClick={handleClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            flexGrow: 0,
            p: 1.5,
            pt: 0,
            maxWidth: '100%',
            borderRadius: blockRadius,
            bgcolor: bgColor,
            overflowWrap: 'break-word',
            overflow: 'hidden',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          <Typography
            component={'span'}
            variant={'body2'}
            fontSize={14}
            sx={{
              alignSelf: isRevert ? 'flex-end' : 'flex-start',
              overflowWrap: 'break-word',
              width: '100%',
              minWidth: '150px',
              maxWidth: '100%',

              '& blockquote::before': {
                content: `"${replyAuthor}"`,
                display: 'block',
                fontSize: 15,
                color: stringToColor('testa'),
                fontWeight: 600,
              },

              '& blockquote': {
                display: 'flex',
                flexDirection: 'column',
                m: '-16px',
                ml: '-12px',
                mb: 0.6,
                p: 1.5,
                bgcolor: '#e8e8ec',
                width: 'calc(100% - 3px)',
                overflow: 'hidden',
                ...(isRevert
                  ? { borderRight: '3px solid #b1b1b1c3' }
                  : { borderLeft: '3px solid #b1b1b1c3' }),
              },

              '& img': {
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
              },
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              style={{ paddingTop: '16px' }}
            />
          </Typography>
          {footer}
        </ListItemButton>
      </Box>
      {/* <ReactionPanel
        id={id}
        isOpen={isOpenTools}
        anchorElement={anchorElement}
        handleClose={handleClose}
      /> */}
    </StyledListItem>
  )
}

export default MessagesListItem
