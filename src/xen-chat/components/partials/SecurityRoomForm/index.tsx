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
  FormGroup,
  IconButton,
  InputAdornment,
  Typography,
  TextField,
  Box,
} from '@mui/material'
import { DefaultCopyField } from '@eisberg-labs/mui-copy-field'
import { sxButton } from '@app/themes/components/button'
import { sxInput } from '@app/themes/components/input'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const SecurityRoomForm = () => {
  const securityProps = useChatStore(state => state.securityRoomProps)
  const setSecurityKey = useChatStore(state => state.setSecurityKey)

  const [confirmSaveKey, setConfirmSaveKey] = useState(true)

  const [isLoading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const handleClose = () => {
    if (setSecurityKey.resolve) {
      setSecurityKey?.resolve(undefined)
    }
  }

  const onConfirm = () => {
    setConfirmSaveKey(true)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries((formData as any).entries())

    if (setSecurityKey.resolve) {
      await setSecurityKey?.resolve(formJson.key.trim())

      setLoading(false)
    }
  }

  useEffect(() => {
    setConfirmSaveKey(Boolean(securityProps?.keyReceived))
  }, [securityProps])

  return (
    <Dialog
      disablePortal
      open={Boolean(securityProps)}
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
        Secure conversation: {securityProps?.title}
      </DialogTitle>
      <DialogContent>
        <Typography mb={1} fontSize={14}>
          {confirmSaveKey
            ? 'Conversation is protected by key'
            : 'Save it so you can enter this conversation. After confirming receipt of the key, it will be deleted from the database and is no available.'}
        </Typography>
        <FormGroup sx={{ gap: 0.6 }}>
          {confirmSaveKey ? (
            <Box display="flex" sx={{ position: 'relative' }}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="enter-conversation-key"
                name="key"
                label="Enter the conversation key"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                sx={{
                  ...sxInput,
                  '& .MuiInputBase-input': { paddingRight: '48px' },
                }}
              />
              <InputAdornment
                position="end"
                sx={{ position: 'absolute', top: '50%', right: '25px' }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            </Box>
          ) : (
            <DefaultCopyField
              margin="dense"
              id="conversation-key"
              name="conversation-key"
              label="Your key for conversation"
              type="text"
              value={securityProps?.generateKey}
              fullWidth
              variant="outlined"
              sx={sxInput}
            />
          )}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button sx={sxButton} variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        {confirmSaveKey ? (
          <Button sx={sxButton} variant="contained" type="submit">
            Send
          </Button>
        ) : (
          <Button
            sx={sxButton}
            variant="contained"
            onClick={onConfirm}
            type="button"
          >
            Confirm
          </Button>
        )}
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

export default SecurityRoomForm
