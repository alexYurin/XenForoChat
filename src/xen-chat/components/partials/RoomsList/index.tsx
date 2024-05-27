import { useEffect, useRef } from 'react'
import { Box, Button, CircularProgress, List, SxProps } from '@mui/material'
import { Empty } from '@app/components/ui'
import { useChatStore } from '@app/store'
import RoomsListItem from './RoomsListItem'
import { sortRoomsByDate } from './helpers'
import { XenChatMode } from '@app/enums'

// @TODO Decompose

export type RoomsListProps = {
  sx?: SxProps
}

const RoomsList = ({ sx }: RoomsListProps) => {
  const mode = useChatStore(state => state.mode)
  const isReady = useChatStore(state => state.isReady)
  const rooms = useChatStore(state => state.rooms)
  const setVisibleAddForm = useChatStore(state => state.setVisibleAddRoomForm)
  const loadMoreRooms = useChatStore(state => state.loadMoreRooms)

  const observerTarget = useRef<HTMLDivElement>(null)

  const onPressAddConversationButton = () => {
    setVisibleAddForm(true)
  }

  const sxListProps: SxProps = {
    width: '100%',
    p: 0,
    bgcolor: 'background.paper',
    overflowX: 'hidden',
    overflowY: 'auto',
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
    ...sx,
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && (rooms?.length ?? 0) > 0) {
          loadMoreRooms()
        }
      },
      { threshold: 1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget, rooms])

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

  return (
    <>
      {isReady ? (
        renderRooms()
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress color="primary" />
        </Box>
      )}
      <span
        ref={observerTarget}
        style={{
          visibility: 'hidden',
        }}
      />
    </>
  )
}

export default RoomsList
