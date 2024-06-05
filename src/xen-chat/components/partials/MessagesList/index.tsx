import { useRef, useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  LinearProgress,
  List,
  SxProps,
  Typography,
} from '@mui/material'
import Messages from './Messages'
import { useChatStore } from '@app/store'

// @TODO Decompose
// @TODO Optimize

export type MessagesListProps = {
  sx?: SxProps
}

const MessagesList = ({ sx }: MessagesListProps) => {
  const currentPage = useChatStore(state => state.currentRoomMessagesPage)

  const loadMoreCurrentRoomMessages = useChatStore(
    state => state.loadMoreCurrentRoomMessages,
  )

  const loadingRoom = useChatStore(state => state.loadingRoom)

  const [isLoadingMore, setLoadingMore] = useState(false)

  const observerTarget = useRef<HTMLDivElement>(null)
  const listTarget = useRef<HTMLUListElement>(null)

  const isEndPages = currentPage === 1

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          let lastScrollTop = listTarget.current?.scrollTop

          setLoadingMore(true)

          loadMoreCurrentRoomMessages().finally(() => {
            if (listTarget.current && lastScrollTop !== undefined) {
              listTarget.current!.scrollTop = lastScrollTop!
            }

            setLoadingMore(false)
          })
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
  }, [observerTarget])

  return (
    <>
      {isLoadingMore && (
        <Box
          sx={{
            position: 'absolute',
            top: '88px',
            left: '0',
            width: '100%',
            color: '#ccc',
            zIndex: 2,
          }}
        >
          <LinearProgress color="inherit" />
        </Box>
      )}
      {loadingRoom && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ccc',
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
      <List
        ref={listTarget}
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column-reverse',
          mt: 'auto',
          gap: 2,
          paddingX: 2,
          paddingY: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          opacity: loadingRoom ? 0.5 : 1,
          pointerEvents: loadingRoom ? 'none' : undefined,
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
        }}
      >
        <Messages />
        <span ref={observerTarget} style={{ visibility: 'hidden' }} />
        {isEndPages && (
          <Typography
            textAlign="center"
            textTransform="uppercase"
            fontSize="10px"
            color="GrayText"
          >
            Start conversation
          </Typography>
        )}
      </List>
    </>
  )
}

export default MessagesList
