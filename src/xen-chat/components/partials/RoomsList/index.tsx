import { Button, List, SxProps } from '@mui/material'
import { Empty } from '@app/components/ui'
import { useChatStore } from '@app/store'
import RoomsListItem from './RoomsListItem'
import { sortRoomsByDate } from './helpers'
import { XenChatMode } from '@app/enums'

export type RoomsListProps = {
  containerHeight: number
}

const RoomsList = ({ containerHeight }: RoomsListProps) => {
  const mode = useChatStore(state => state.mode)
  const rooms = useChatStore(state => state.rooms)
  const setVisibleAddForm = useChatStore(state => state.setVisibleAddRoomForm)

  const onPressAddConversationButton = () => {
    setVisibleAddForm(true)
  }

  // @TODO Calculate
  const maxContentHeight = containerHeight - 132

  const sxListProps: SxProps = {
    width: '100%',
    p: 0,
    bgcolor: 'background.paper',
    overflowX: 'hidden',
    overflowY: 'auto',
    maxHeight:
      mode === XenChatMode.POPUP ? maxContentHeight - 28 : maxContentHeight,
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 6,
      backgroundColor: 'rgba(0,0,0,0.15)',
    },
  }

  const renderRooms = () => {
    if (rooms && rooms.length) {
      return (
        <List sx={sxListProps}>
          {sortRoomsByDate(rooms).map(room => {
            return <RoomsListItem key={room.model.id} detail={room.model} />
          })}
        </List>
      )
    }

    return (
      <Empty text="Conversation list is empty" sx={{ height: '100%' }}>
        <Button
          aria-label="Create"
          size="large"
          variant="outlined"
          sx={{ borderRadius: 4, fontSize: 10 }}
          onClick={onPressAddConversationButton}
        >
          Add conversation
        </Button>
      </Empty>
    )
  }

  return renderRooms()
}

export default RoomsList
