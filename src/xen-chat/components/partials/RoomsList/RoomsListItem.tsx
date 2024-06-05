import { RefObject, useEffect, useRef } from 'react'
import {
  Box,
  LinearProgress,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material'
import { AvatarExt } from '@app/components/ui'
import { RoomModelType } from '@app/core/domain/Room'
import { stripTagsFromHTML, dateFromNow } from '@app/helpers'
import { useChatStore } from '@app/store'
import LockIcon from '@mui/icons-material/Lock'

export type RoomsListItemProps = {
  listRef: RefObject<HTMLUListElement>
  detail: RoomModelType
}

const RoomsListItem = ({ listRef, detail }: RoomsListItemProps) => {
  const currentRoom = useChatStore(state => state.currentRoom)
  const loadingRoom = useChatStore(state => state.loadingRoom)
  const setCurrentRoom = useChatStore(state => state.setCurrentRoom)

  const ref = useRef<HTMLLIElement>(null)

  const onPressRoomItem = () => {
    setCurrentRoom(detail.id)
  }

  const isSelected = currentRoom?.model.id === detail.id
  const isUnread = detail.isUnread

  // @TODO Calculate
  const calcWidthText = 'calc(100% - 22px)'

  const lastMessage = stripTagsFromHTML(
    detail.lastMessage?.model.textParsed || '',
  )

  useEffect(() => {
    if (
      currentRoom?.model.id === detail.id &&
      ref.current &&
      listRef.current &&
      loadingRoom === null
    ) {
      const top = ref.current.getBoundingClientRect().top
      const offset = 500

      setTimeout(() => {
        listRef.current?.scrollTo({
          top: top - offset,
          behavior: 'smooth',
        })
      }, 200)
    }
  }, [ref, listRef, loadingRoom])

  const label = (
    <Box sx={{ display: 'flex', flexFlow: 'nowrap', position: 'relative' }}>
      {detail.security.enabled && (
        <Box display="flex" alignItems="center" sx={{ mr: 0.5, ml: '-2px' }}>
          <LockIcon sx={{ width: 14, height: 14, color: 'red' }} />
        </Box>
      )}
      <Typography
        noWrap={true}
        sx={{
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {detail.title}
      </Typography>
    </Box>
  )

  const description = (
    <Box sx={{ display: 'flex', flexFlow: 'nowrap' }}>
      <Typography
        color="GrayText"
        noWrap={true}
        sx={{ fontSize: 13, fontWeight: detail.isUnread ? 500 : 400 }}
      >
        {lastMessage}
      </Typography>
    </Box>
  )

  return (
    <ListItem
      ref={ref}
      onClick={onPressRoomItem}
      sx={{
        position: 'relative',
        paddingX: 0,
        paddingY: 0,
        pointerEvents: loadingRoom ? 'none' : 'unset',
        bgcolor: isUnread ? '#eeeeee59' : '#fff',
      }}
    >
      <ListItemButton
        selected={isSelected}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingX: 0,
          paddingY: 0,
          '&.Mui-selected': {
            bgcolor: 'rgba(213, 213, 213, 0.4)',
          },
          '&.Mui-selected:hover': {
            bgcolor: 'rgba(213, 213, 213, 0.6)',
          },
        }}
      >
        <AvatarExt
          badgeCount={detail.isUnread ? 1 : 0}
          isSmallBadgeCount={true}
          isStared={detail.isStared}
          avatarText={detail.title}
          src={detail.owner.model.avatar}
          label={
            <>
              {label}
              {detail.note && (
                <Typography
                  pb={0.2}
                  noWrap
                  fontSize={10}
                  fontWeight={500}
                  color="#f47d02"
                  sx={{
                    display: 'inline-block',
                    maxWidth: '90%',
                    justifySelf: 'flex-start',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {detail.note}
                </Typography>
              )}
            </>
          }
          description={description}
          sx={{
            paddingX: 1.4,
            bgcolor: 'transparent',
            width: calcWidthText,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Typography
              component="time"
              sx={{
                fontSize: 11,
                whiteSpace: 'nowrap',
              }}
            >
              {dateFromNow(detail.lastMessageDate)}
            </Typography>
          </Box>
        </AvatarExt>
        {loadingRoom === detail.id && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              left: 0,
              bottom: 0,
              color: '#ccc',
            }}
          >
            <LinearProgress color="inherit" />
          </Box>
        )}
      </ListItemButton>
    </ListItem>
  )
}

export default RoomsListItem
