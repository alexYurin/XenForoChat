import { useRef, useEffect } from 'react'
import { List, LinearProgress, Box } from '@mui/material'
import Messages from './Messages'
import { useChatStore } from '@app/store'
import { XenChatMode } from '@app/enums'

// @TODO Decompose
// @TODO Optimize

export type MessageListProps = {
  containerHeight?: number
}

const MessagesList = ({ containerHeight }: MessageListProps) => {
  const mode = useChatStore(state => state.mode)

  const loadMoreCurrentRoomMessages = useChatStore(
    state => state.loadMoreCurrentRoomMessages,
  )

  const isLoadingMessages = useChatStore(state => state.isLoadingMessages)

  const observerTarget = useRef<HTMLDivElement>(null)
  const listTarget = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          let lastScrollTop = listTarget.current?.scrollTop

          loadMoreCurrentRoomMessages().finally(() => {
            if (listTarget.current && lastScrollTop !== undefined) {
              listTarget.current!.scrollTop = lastScrollTop!
            }
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
        opacity: isLoadingMessages ? 0.5 : 1,
        pointerEvents: isLoadingMessages ? 'none' : undefined,
        height:
          mode === XenChatMode.POPUP
            ? `${containerHeight! - 176}px`
            : undefined,
        maxHeight:
          mode === XenChatMode.POPUP
            ? `${containerHeight! - 176}px`
            : undefined,
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
      }}
    >
      <Messages />
      <span ref={observerTarget} style={{ visibility: 'hidden' }} />
    </List>
  )
}

export default MessagesList
