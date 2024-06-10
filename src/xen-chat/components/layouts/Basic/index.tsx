import { useRef, useState } from 'react'
import {
  MessagesList,
  RoomSearch,
  RoomsList,
  ToolsPanel,
  AccountDetail,
} from '@app/components/partials'
import { styled } from '@mui/material/styles'
import { Paper, Grid, Box, Divider, SxProps } from '@mui/material'
import { useChatStore } from '@app/store'
import { Empty } from '@app/components/ui'
import { LayoutProps } from '@app/components/layouts/types'

const BasicLayout = ({ inputComponent }: LayoutProps) => {
  const rootHeight = useChatStore(state => state.rootHeight)
  const currentRoom = useChatStore(state => state.currentRoom)
  const resetCurrentRoom = useChatStore(state => state.resetCurrentRoom)

  const [isVisibleMessagesBox, setVisibleMessagesBox] = useState(
    Boolean(currentRoom),
  )

  const closeMessagesBox = () => {
    setVisibleMessagesBox(false)
    resetCurrentRoom()
  }

  const accountDetailRef = useRef<HTMLDivElement>(null)
  const roomSearchRef = useRef<HTMLFormElement>(null)

  const isShowMessagesContent = currentRoom !== null

  // @TODO Replace in styles
  const sxContainerProps: SxProps = {
    position: 'relative',
    p: 0,
    width: '100%',
    height: '100%',
    maxHeight: rootHeight,
    overflow: 'auto',
  }

  const sxSectionProps: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 0,
  }

  const StyledRoomsBox = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {},
  }))

  const StyledMessagesBox = styled(Grid)(({ theme }) => ({
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      display: isVisibleMessagesBox || isShowMessagesContent ? 'grid' : 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      paddingLeft: '0 !important',
      paddingTop: '0 !important',
      width: '100%',
      zIndex: 2,
    },
  }))

  const sxDivider: SxProps = {
    m: 0,
    opacity: 0.5,
  }

  const accountDetailHeight = accountDetailRef?.current?.offsetHeight || 0
  const roomSearchHeight = roomSearchRef?.current?.offsetHeight || 0

  const sectionHeight =
    rootHeight! - (accountDetailHeight + roomSearchHeight + 32)

  return (
    <Box component="section" sx={sxContainerProps}>
      <Grid container spacing={1} height="100%">
        <StyledRoomsBox item lg={3.5} md={4.5} xs={12}>
          <Paper elevation={0} sx={sxSectionProps}>
            <AccountDetail elRef={accountDetailRef} />
            <Divider sx={sxDivider} />
            <RoomSearch elRef={roomSearchRef} />
            <Divider sx={sxDivider} />
            <RoomsList sx={{ height: sectionHeight + 18 }} />
          </Paper>
        </StyledRoomsBox>
        <StyledMessagesBox item lg={8.5} md={7.5} xs={12}>
          <Paper elevation={0} sx={sxSectionProps}>
            {isShowMessagesContent ? (
              <>
                <ToolsPanel closeHandler={closeMessagesBox} />
                <Divider sx={sxDivider} />
                <MessagesList sx={{ height: sectionHeight }} />
                <Divider sx={sxDivider} />
                {inputComponent}
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
