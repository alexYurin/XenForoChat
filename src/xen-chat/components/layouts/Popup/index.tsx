import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Paper, Grid, Box, Divider, SxProps } from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import {
  MessagesList,
  MessageInput,
  RoomSearch,
  RoomsList,
  ToolsPanel,
  AccountDetail,
  AppControl,
} from '@app/components/partials'
import { Empty } from '@app/components/ui'
import { useChatStore } from '@app/store'
import type { LayoutProps } from '@app/components/layouts/types'

const PopupLayout = ({ root, closeApp }: LayoutProps) => {
  const currentRoom = useChatStore(state => state.currentRoom)

  const [isVisibleMessagesBox, setVisibleMessagesBox] = useState(
    Boolean(currentRoom),
  )

  const resetCurrentRoom = useChatStore(state => state.resetCurrentRoom)

  const [isMinimize, setMinimize] = useState(false)

  const isShowMessagesContent = currentRoom !== null

  const closeMessagesBox = () => {
    setVisibleMessagesBox(false)
    resetCurrentRoom()
  }

  const changeMinimize = (isMinimize: boolean) => {
    root.classList.toggle('minimize')

    setMinimize(isMinimize)
  }

  // @TODO Calculate
  const maxContentHeight = root.offsetHeight - 32

  // @TODO Replace in styles
  const sxWrapperProps: SxProps = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    p: 0.5,
    pb: isMinimize ? 0 : 0.5,
    width: '100%',
    backgroundColor: isMinimize ? 'transparent' : '#999',
    borderRadius: 4,
  }

  const sxContainerProps: SxProps = {
    position: 'relative',
    p: 0,
    height: '100%',
    maxHeight: `${root.offsetHeight}px`,
    overflow: 'hidden',
    borderRadius: 4,
  }

  const sxSectionProps: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  }

  const StyledRoomsBox = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {},
  }))

  const StyledMessagesBox = styled(Grid)(({ theme }) => ({
    display: isShowMessagesContent || isVisibleMessagesBox ? 'grid' : 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 2,
    [theme.breakpoints.down('md')]: {},
  }))

  const sxDivider: SxProps = {
    m: 0,
    opacity: 0.5,
  }

  return (
    <Box sx={sxWrapperProps}>
      <AppControl
        isMinimize={isMinimize}
        setMinimize={changeMinimize}
        closeHandler={closeApp}
      />
      {!isMinimize && (
        <Paper elevation={10} component="section" sx={sxContainerProps}>
          <Grid container height="100%">
            <StyledRoomsBox item xs={12}>
              <Paper elevation={0} sx={sxSectionProps}>
                <AccountDetail />
                <Divider sx={sxDivider} />
                <RoomSearch />
                <Divider sx={sxDivider} />
                <RoomsList containerHeight={maxContentHeight} />
              </Paper>
            </StyledRoomsBox>
            <StyledMessagesBox item xs={12}>
              <Paper elevation={0} sx={sxSectionProps}>
                {isShowMessagesContent ? (
                  <>
                    <ToolsPanel
                      isShowBackButton={true}
                      closeHandler={closeMessagesBox}
                    />
                    <Divider sx={sxDivider} />
                    <MessagesList containerHeight={maxContentHeight} />
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
        </Paper>
      )}
    </Box>
  )
}

export default PopupLayout
