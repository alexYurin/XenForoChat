import { Paper, IconButton, Badge } from '@mui/material'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import HorizontalRuleOutlinedIcon from '@mui/icons-material/HorizontalRuleOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useChatStore } from '@app/store'

export type AppControlProps = {
  isMinimize: boolean
  closeHandler: () => void
  setMinimize: (isMinimize: boolean) => void
}

const AppControl = ({
  isMinimize,
  setMinimize,
  closeHandler,
}: AppControlProps) => {
  const rooms = useChatStore(state => state.rooms)

  const link = '/conversations'

  const unreadRooms = rooms?.filter(room => room.model.isUnread)

  const changeMinimize = () => {
    if (!isMinimize) {
      return
    }

    setMinimize(!isMinimize)
  }

  const minimize = () => {
    setMinimize(true)
  }

  const badgeMessageButton = (
    <Badge
      badgeContent={unreadRooms?.length}
      overlap="circular"
      color="warning"
      onClick={changeMinimize}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{ mr: 'auto', cursor: 'pointer' }}
    >
      <IconButton>
        <MessageOutlinedIcon />
      </IconButton>
    </Badge>
  )

  return (
    <Paper
      sx={{
        display: 'flex',
        mb: 0.5,
        p: 1,
        borderRadius: '16px',
      }}
    >
      {isMinimize ? (
        badgeMessageButton
      ) : (
        <>
          {badgeMessageButton}
          <IconButton onClick={minimize} sx={{ ml: 'auto' }}>
            <HorizontalRuleOutlinedIcon />
          </IconButton>
          <IconButton component="a" href={link} target="_blank">
            <OpenInNewOutlinedIcon />
          </IconButton>
          <IconButton onClick={closeHandler}>
            <CloseOutlinedIcon />
          </IconButton>
        </>
      )}
    </Paper>
  )
}

export default AppControl
