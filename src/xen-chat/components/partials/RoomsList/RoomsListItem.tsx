import { Box, ListItem, ListItemButton, Typography } from '@mui/material'
import { AvatarExt } from '@app/components/ui'
import { RoomModelType } from '@app/core/domain/Room'
import { stripTagsFromHTML, dateFromNow } from '@app/helpers'
import { useChatStore } from '@app/store'

export type RoomsListItemProps = {
  detail: RoomModelType
}

const RoomsListItem = ({ detail }: RoomsListItemProps) => {
  const currentRoom = useChatStore(state => state.currentRoom)
  const setCurrentRoom = useChatStore(state => state.setCurrentRoom)

  const onPressRoomItem = () => {
    setCurrentRoom(detail.id)
  }

  const isSelected = currentRoom?.model.id === detail.id

  // @TODO Calculate
  const calcWidthText = 'calc(100% - 22px)'

  const lastMessage = stripTagsFromHTML(
    detail.lastMessage?.model.textParsed || '',
  )

  const label = (
    <Box sx={{ display: 'flex', flexFlow: 'nowrap' }}>
      <Typography noWrap={true} sx={{ fontSize: 14, fontWeight: 500 }}>
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
    <ListItem sx={{ paddingX: 0, paddingY: 0 }} onClick={onPressRoomItem}>
      <ListItemButton
        selected={isSelected}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingX: 0,
          paddingY: 0,
          '&.Mui-selected': {
            bgcolor: 'rgba(213, 213, 213, 0.2)',
          },
          '&.Mui-selected:hover': {
            bgcolor: 'rgba(213, 213, 213, 0.1)',
          },
        }}
      >
        <AvatarExt
          badgeCount={detail.isUnread ? 1 : 0}
          avatarBadgeVariant="dot"
          isStared={detail.isStared}
          avatarText={detail.title}
          label={
            <>
              {label}
              {detail.note && (
                <Typography
                  pb={0.2}
                  noWrap
                  fontSize={11}
                  sx={{
                    display: 'inline-block',
                    maxWidth: '90%',
                    justifySelf: 'flex-start',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Note: Note text for room
                </Typography>
              )}
            </>
          }
          description={description}
          sx={{
            paddingX: 1.4,
            // pb: 0,
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
      </ListItemButton>
    </ListItem>
  )
}

export default RoomsListItem
