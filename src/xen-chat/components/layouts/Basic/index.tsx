import { useState } from 'react'
import {
  MessagesList,
  MessageInput,
  RoomSearch,
  RoomsList,
  ToolsPanel,
  AccountDetail,
} from '@app/components/partials'
import { styled } from '@mui/material/styles'
import { Paper, Grid, Box, Divider, SxProps } from '@mui/material'
import { useChatStore } from '@app/store'
import type { LayoutProps } from '@app/components/layouts/types'
import { Empty } from '@app/components/ui'
import zIndex from '@mui/material/styles/zIndex'

const BasicLayout = ({ root }: LayoutProps) => {
  const currentRoom = useChatStore(state => state.currentRoom)

  const resetCurrentRoom = useChatStore(state => state.resetCurrentRoom)

  const [isVisibleMessagesBox, setVisibleMessagesBox] = useState(
    Boolean(currentRoom),
  )

  const closeMessagesBox = () => {
    setVisibleMessagesBox(false)
    resetCurrentRoom()
  }

  const isShowMessagesContent = currentRoom !== null

  // @TODO Calculate
  const maxContentHeight = root.offsetHeight - 32

  // @TODO Replace in styles
  const sxContainerProps: SxProps = {
    position: 'relative',
    p: 2,
    width: '100%',
    height: '100%',
    maxHeight: `${root.offsetHeight}px`,
    overflow: 'auto',
  }

  const sxSectionProps: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 4,
    maxHeight: maxContentHeight,
  }

  const StyledRoomsBox = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {},
  }))

  const StyledMessagesBox = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      display: isVisibleMessagesBox || isShowMessagesContent ? 'grid' : 'none',
      position: 'absolute',
      top: 8,
      left: 8,
      width: 'calc(100% - 24px)',
      height: maxContentHeight,
      zIndex: 2,
    },
  }))

  const sxDivider: SxProps = {
    m: 0,
    opacity: 0.5,
  }

  return (
    <Box component="section" sx={sxContainerProps}>
      <Grid container spacing={1} height="100%">
        <StyledRoomsBox item lg={3.5} md={4.5} xs={12}>
          <Paper elevation={0} sx={sxSectionProps}>
            <AccountDetail />
            <Divider sx={sxDivider} />
            <RoomSearch />
            <Divider sx={sxDivider} />
            <RoomsList containerHeight={maxContentHeight} />
          </Paper>
        </StyledRoomsBox>
        <StyledMessagesBox item lg={8.5} md={7.5} xs={12}>
          <Paper elevation={0} sx={sxSectionProps}>
            {isShowMessagesContent ? (
              <>
                <ToolsPanel closeHandler={closeMessagesBox} />
                <Divider sx={sxDivider} />
                <MessagesList />
                <Divider sx={sxDivider} />
                <MessageInput />
              </>
            ) : (
              <Empty
                icon={''}
                text="Select a conversation or create a new one"
                sx={{ height: '100%' }}
              />
            )}
          </Paper>
        </StyledMessagesBox>
      </Grid>
    </Box>
  )
}

export default BasicLayout
