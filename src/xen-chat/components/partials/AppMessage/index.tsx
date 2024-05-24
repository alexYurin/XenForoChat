import { useChatStore } from '@app/store'
import { Alert, Snackbar } from '@mui/material'

const AppMessage = () => {
  const error = useChatStore(state => state.error)
  const resetError = useChatStore(state => state.resetError)

  const onClose = () => {
    resetError()
  }

  return error ? (
    <Snackbar
      open={Boolean(error)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity="error"
        variant="filled"
        sx={{ width: '100%', fontSize: 14 }}
      >
        {error.message}
      </Alert>
    </Snackbar>
  ) : null
}

export default AppMessage
