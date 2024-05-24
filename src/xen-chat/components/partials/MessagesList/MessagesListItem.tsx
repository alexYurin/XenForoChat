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
import { AvatarExt } from '@app/components/ui'
import ReactionPanel from './ReactionPanel'
import { dateFromNow, fromHTML, stringToColor } from '@app/helpers'
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'

import bbCodeParser from 'bbcode-to-react'
import { MessageModelType } from '@app/core/domain/Message'
import { useChatStore } from '@app/store'
import { XenChatMode } from '@app/enums'

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

  const blockRadius = isRevert ? '18px 0 18px 18px' : '0 18px 18px 18px'

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
      mt={0.5}
      gap={2}
      height={20}
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
        p: 0,
        gap: 0.5,
        maxWidth: mode === XenChatMode.POPUP ? '90%' : '60%',
        width: 'max-content',
        ...containerStyles,
        [`&:hover [id=message-box-${detail.id}]`]: {
          display: isRoomLock ? 'none' : 'flex',
        },
      }}
    >
      <AvatarExt
        src={detail.member.model.avatar}
        avatarText={detail.member.model.name}
        isOnline={isRevert}
        sx={{ p: 0 }}
      />
      <Box
        id={`message-box-${detail.id}`}
        display="none"
        flexDirection="column"
        gap={0.5}
        sx={{
          position: 'absolute',
          top: 0,
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
      <ListItemButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          flexGrow: 0,
          p: 1.5,
          pt: 1,
          maxWidth: '100%',
          borderRadius: blockRadius,
          bgcolor: bgColor,
          overflowWrap: 'break-word',
          '&:hover': {
            opacity: 0.9,
          },
        }}
      >
        <Typography
          mb={0.2}
          alignSelf={isRevert ? 'flex-end' : 'flex-start'}
          fontSize={14}
          fontWeight={500}
          color={stringToColor('UserName')}
          sx={{ overflowWrap: 'break-word', maxWidth: '100%' }}
        >
          {detail.member.model.name}
        </Typography>
        <Typography
          component={'span'}
          variant={'body2'}
          fontSize={14}
          sx={{
            alignSelf: isRevert ? 'flex-end' : 'flex-start',
            overflowWrap: 'break-word',
            width: '100%',
            minWidth: '100px',
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
              m: 0,
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
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Typography>
        {footer}
      </ListItemButton>
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
