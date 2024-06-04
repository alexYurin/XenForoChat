import { useEffect, useRef, memo, useState } from 'react'
import { Box, Button, CircularProgress, List, SxProps } from '@mui/material'
import { Empty } from '@app/components/ui'
import { useChatStore } from '@app/store'
import RoomsListItem from './RoomsListItem'
import { sortRoomsByDate } from './helpers'
import { useIntersection } from './useIntersection'

// @TODO Decompose

export type RoomsListProps = {
  sx?: SxProps
}

let lastScrollTop = 0

const RoomsList = memo(({ sx }: RoomsListProps) => {
  const isReady = useChatStore(state => state.isReady)
  const rooms = useChatStore(state => state.rooms)
  const setVisibleAddForm = useChatStore(state => state.setVisibleAddRoomForm)
  const loadMoreRooms = useChatStore(state => state.loadMoreRooms)

  const observerStartTarget = useRef<HTMLDivElement>(null)
  const observerLastTarget = useRef<HTMLDivElement>(null)
  const listTarget = useRef<HTMLUListElement>(null)

  const isLoadingRoomsLastMore = useIntersection(
    observerLastTarget,
    rooms || [],
    loadMoreRooms,
  )

  const onPressAddConversationButton = () => {
    setVisibleAddForm(true)
  }

  const onScroll = () => {
    lastScrollTop = listTarget.current!.scrollTop
  }

  const sxListProps: SxProps = {
    width: '100%',
    p: 0,
    bgcolor: 'background.paper',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: !rooms?.length || !isReady ? 'absolute' : 'relative',
    visibility: !rooms?.length || !isReady ? 'hidden' : 'visible',
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
    if (listTarget.current) {
      listTarget.current.scrollTop = lastScrollTop
    }

    listTarget.current?.addEventListener('scroll', onScroll)

    return () => listTarget.current?.removeEventListener('scroll', onScroll)
  }, [listTarget])

  return (
    <>
      <List ref={listTarget} className="room-list" sx={sxListProps}>
        <span
          ref={observerStartTarget}
          style={{
            visibility: 'hidden',
          }}
        />
        {sortRoomsByDate(rooms || []).map(room => {
          return (
            <RoomsListItem
              key={room.model.id}
              listRef={listTarget}
              detail={room.model}
            />
          )
        })}
        {isReady && isLoadingRoomsLastMore && (
          <Box
            sx={{
              position: 'relative',
              justifySelf: 'center',
              alignSelf: 'center',
              mt: 1,
              textAlign: 'center',
              color: '#ccc',
              zIndex: 2,
            }}
          >
            <CircularProgress color="inherit" size={26} />
          </Box>
        )}
        <span
          ref={observerLastTarget}
          style={{
            visibility: 'hidden',
          }}
        />
      </List>
      {isReady && !rooms?.length && (
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
      )}
      {!isReady && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          color="#ccc"
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </>
  )
})

export default RoomsList
