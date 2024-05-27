import { useEffect, useState } from 'react'
import { useChatStore } from '@app/store'
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
  SxProps,
  TextField,
} from '@mui/material'
import { sxButton } from '@app/themes/components/button'
import { sxInput } from '@app/themes/components/input'
import { MembersAutocomplete } from '@app/components/ui'
import { RequestParamsAddConversation, UserType } from '@app/api/xenforo/types'

export type AddRoomFormProps = {
  onClose?: () => void
}

const AddRoomForm = ({ onClose }: AddRoomFormProps) => {
  const addNewRoom = useChatStore(state => state.addNewRoom)
  const isVisible = useChatStore(state => state.isVisibleAddRoomForm)
  const setVisible = useChatStore(state => state.setVisibleAddRoomForm)
  const inviteUser = useChatStore(state => state.inviteUser)

  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setLoading] = useState(false)

  const handleClose = () => {
    setVisible(false)

    if (typeof onClose === 'function') {
      onClose()
    }
  }

  const onAddUsers = (users: UserType[]) => {
    setUsers(users)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries((formData as any).entries())

    if (users.length === 0) {
      return
    }

    setLoading(true)

    let params: Partial<RequestParamsAddConversation> = {
      recipient_ids: users.map(user => user.user_id),
      title: formJson.title,
      note: formJson.note ?? '',
      message: formJson.message ?? '',
    }

    if (formJson.open_invite === 'on') {
      params = {
        ...params,
        open_invite: '1',
      }
    }

    params = {
      ...params,
      conversation_open: formJson.conversation_open === 'on' ? '0' : '1',
    }

    addNewRoom(params as RequestParamsAddConversation)
      .then(handleClose)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (inviteUser) {
      setUsers([inviteUser])
    }
  }, [inviteUser])

  const sxFormLabelProps: SxProps = {
    mb: 2,
    '& .MuiTypography-root': {
      fontSize: 14,
    },
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
        Add conversation
      </DialogTitle>
      <DialogContent>
        <FormGroup sx={{ gap: 0.6 }}>
          <MembersAutocomplete
            label="Add recipients"
            placeholder="Add recipients"
            onChange={onAddUsers}
            defaultValue={users}
            required
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="add-conversation-title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            sx={sxInput}
          />
          <TextField
            autoFocus
            margin="dense"
            id="add-conversation-none"
            name="note"
            label="Note"
            type="text"
            fullWidth
            variant="outlined"
            sx={sxInput}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="add-conversation-message"
            name="message"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            sx={sxInput}
          />
        </FormGroup>
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch name="open_invite" />}
            label="Allow anyone in the conversation to invite others"
            sx={sxFormLabelProps}
          />
          <FormControlLabel
            control={<Switch name="conversation_open" />}
            label="Lock conversation (no responses will be allowed)"
            sx={sxFormLabelProps}
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button sx={sxButton} variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button sx={sxButton} variant="contained" type="submit">
          Create
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

export default AddRoomForm
