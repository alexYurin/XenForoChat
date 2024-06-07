import { sxButton } from '@app/themes/components/button'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { RoomModelType } from '@app/core/domain/Room'

export type ActionDialogProps = {
  detail: RoomModelType['actions'][0] | null
  handleClose: () => void
}

const ActionDialog = ({ detail, handleClose }: ActionDialogProps) => {
  const isVisible = Boolean(detail)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!detail) {
      return
    }

    handleClose()

    if (detail.isTargetBlank) {
      window.open(detail.url, '_blank')

      return
    }

    window.location.href = detail.url
  }

  return (
    <Dialog
      disablePortal
      open={isVisible}
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
        {detail?.title}
      </DialogTitle>
      <DialogContentText paddingX="24px" fontSize={14}>
        {detail?.confirmation}
      </DialogContentText>
      <DialogActions>
        <Button sx={sxButton} variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button sx={sxButton} color="primary" variant="contained" type="submit">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActionDialog
