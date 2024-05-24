import { useState } from 'react'
import { useChatStore } from '@app/store'
import { sxButton } from '@app/themes/components/button'
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

const LeaveRoomDialog = () => {
  const room = useChatStore(state => state.visibleLeaveRoomDialog)

  const leaveRoom = useChatStore(state => state.leaveRoom)

  const setVisible = useChatStore(state => state.setVisibleLeaveRoomDialog)

  const [isLoading, setLoading] = useState(false)

  const handleClose = () => {
    setVisible(null)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    leaveRoom(room!.model.id)
      .then(handleClose)
      .finally(() => setLoading(false))
  }

  return (
    <Dialog
      disablePortal
      open={Boolean(room)}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        sx: {
          margin: 1,
          width: '100%',
          borderRadius: '16px',
        },
        onSubmit,
      }}
    >
      <DialogTitle fontSize={16} textTransform="uppercase">
        Leave: Room Title
      </DialogTitle>
      <DialogContentText paddingX="24px" fontSize={14}>
        Do you really want to leave the conversation?
      </DialogContentText>
      <DialogActions>
        <Button sx={sxButton} variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button sx={sxButton} color="error" variant="outlined" type="submit">
          Leave
        </Button>
      </DialogActions>
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  )
}

export default LeaveRoomDialog
