import { useChatStore } from '@app/store'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  FormGroup,
  List,
  ListItem,
  Switch,
  SxProps,
  TextField,
  Typography,
  Stack,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import { sxButton } from '@app/themes/components/button'
import { sxInput } from '@app/themes/components/input'
import { AvatarExt, MembersAutocomplete } from '@app/components/ui'
import { UserType } from '@app/api/xenforo/types'
import { displayName } from '@app/helpers'

// @TODO Decompose
// @TODO Need refactor

const SettingsRoomForm = () => {
  const room = useChatStore(state => state.visibleSettingsRoomForm)

  const updateRoom = useChatStore(state => state.updateRoom)

  const setVisible = useChatStore(state => state.setVisibleSettingsRoomForm)

  const setStarRoom = useChatStore(state => state.setStarRoom)

  const setUnreadRoom = useChatStore(state => state.setUnreadRoom)

  const inviteRoom = useChatStore(state => state.inviteRoom)

  const noteRoom = useChatStore(state => state.noteRoom)

  const setVisibleLeaveDialog = useChatStore(
    state => state.setVisibleLeaveRoomDialog,
  )
  const setVisibleRemoveDialog = useChatStore(
    state => state.setVisibleRemoveRoomDialog,
  )

  const [isLoading, setLoading] = useState(false)

  const [title, setTitle] = useState(room?.model.title)

  const [note, setNote] = useState(room?.model.note)

  const [users, setUsers] = useState<UserType[]>([])

  const [isLockConversation, setLockConversation] = useState(
    !room?.model.isOpenConversation,
  )
  const [isOpenInvite, setOpenInvite] = useState(room?.model.isOpenInvite)

  const [isStared, setStared] = useState(room?.model.isStared)

  const [isUnread, setUnread] = useState(room?.model.isUnread)

  // TODO Add show notifications api
  const [isShowNotifications, setShowNotifications] = useState(false)

  const isCanEdit = room?.model.permissions.isCanEdit
  const isCanInvite =
    room?.model.permissions.isCanInvite && room.model.isOpenInvite

  const isOwner = room?.model.isOwner

  const handleSwitchChange =
    (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked

      switch (type) {
        case 'star':
          setStared(checked)
          break

        case 'unread':
          setUnread(checked)
          break

        case 'openConversation':
          setLockConversation(checked)
          break

        case 'openInvite':
          setOpenInvite(checked)
          break

        default:
          break
      }
    }

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value)
  }

  const handleChangeUsers = (users: UserType[]) => {
    setUsers(users)
  }

  const handleClose = () => {
    setVisible(null)
  }

  const openLeaveDialog = () => {
    handleClose()
    setVisibleLeaveDialog(room)
  }

  const openRemoveDialog = () => {
    handleClose()
    setVisibleRemoveDialog(room)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isChangeSettings =
      (title !== undefined && title !== room?.model.title) ||
      (isLockConversation !== undefined &&
        isLockConversation !== !room?.model.isOpenConversation) ||
      (isOpenInvite !== undefined && isOpenInvite !== room?.model.isOpenInvite)

    const isChangeNote = note !== undefined && note !== room?.model.note

    const isChangeStared =
      isStared !== undefined && isStared !== room!.model.isStared

    const isChangeUnread =
      isUnread !== undefined && isUnread !== room!.model.isUnread

    setLoading(true)

    if (users.length) {
      await inviteRoom(room!.model.id, users)
    }

    if (isChangeNote) {
      await noteRoom(room!.model.id, note)
    }

    if (isChangeSettings) {
      await updateRoom(room!.model.id, {
        title: title || room?.model.title,
        conversation_open: !isLockConversation ? '1' : '0',
        open_invite: isOpenInvite ? '1' : '0',
      })
    }

    if (isChangeStared) {
      await setStarRoom(room!.model.id, isStared)
    }

    if (isChangeUnread) {
      await setUnreadRoom(room!.model.id, isUnread)
    }

    setLoading(false)

    handleClose()
  }

  useEffect(() => {
    if (room) {
      setTitle(room.model.title)
      setNote(room.model.note)
      setLockConversation(!room.model.isOpenConversation)
      setOpenInvite(room.model.isOpenInvite)
      setStared(room.model.isStared)
      setUnread(room.model.isUnread)
    }
  }, [room])

  const sxFormLabelProps: SxProps = {
    mb: 2,
    '& .MuiTypography-root': {
      fontSize: 14,
    },
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
        Conversation: {room?.model.title}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" mb={1}>
          <AvatarExt
            isStared={room?.model.isStared}
            avatarText={room?.model.title}
            sxAvatar={{ width: 60, height: 60 }}
          />
          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingY: 0,
            }}
          >
            <ListItem sx={{ paddingY: 0.5 }}>
              <Typography fontSize={12} mr={1}>
                Starter:
              </Typography>
              <Typography
                component="a"
                href={room?.model.owner.model.link}
                target="_blank"
                fontSize={12}
                fontWeight={599}
                color="#1976d2"
                sx={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                {displayName(
                  room?.model.owner.model.name,
                  room?.model.owner.model.title,
                )}
              </Typography>
            </ListItem>
            <ListItem sx={{ paddingY: 0.5 }}>
              <Typography fontSize={12} mr={1}>
                Participants:
              </Typography>
              <Typography fontSize={12} fontWeight={599}>
                {room?.model.members.length}
              </Typography>
            </ListItem>
          </List>
        </Box>
        <FormGroup>
          <TextField
            autoFocus
            margin="dense"
            id="update-conversation-title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            disabled={!isCanEdit}
            defaultValue={room?.model.title}
            value={title}
            onChange={handleChangeTitle}
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
            multiline
            fullWidth
            defaultValue={room?.model.note}
            value={note}
            onChange={handleChangeNote}
            variant="outlined"
            sx={sxInput}
          />
        </FormGroup>
        <FormGroup sx={{ gap: 0.6 }}>
          <FormLabel
            sx={{
              mt: 2,
              mb: 1,
              fontSize: 14,
              fontWeight: 500,
              textTransform: 'uppercase',
            }}
          >
            Recipients
          </FormLabel>
          <Stack direction="row" sx={{ flexWrap: 'wrap', mb: 1.5, gap: 1 }}>
            {room?.model.members.map(member => {
              return (
                <Chip
                  key={member.model.id}
                  label={displayName(member.model.name, member.model.title)}
                  sx={{ fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                  component="a"
                  title={member.model.title}
                  href={member.model.link}
                  target="_blank"
                  avatar={
                    <AvatarExt
                      isOnline={false}
                      src={member.model.avatar}
                      avatarText={member.model.name}
                    />
                  }
                />
              )
            })}
          </Stack>
        </FormGroup>

        {isCanInvite && (
          <FormGroup sx={{ gap: 0.6 }}>
            <FormLabel
              sx={{
                mt: 1.5,
                mb: -1,
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              Invite
            </FormLabel>
            <MembersAutocomplete
              label="Find recipients"
              placeholder="Find recipients"
              onChange={handleChangeUsers}
            />
          </FormGroup>
        )}

        <Box display="flex" flexDirection="column">
          <FormGroup sx={{ mt: 2 }}>
            <FormLabel
              sx={{
                mt: 1.5,
                mb: 1,
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              Settings
            </FormLabel>
          </FormGroup>
          <FormGroup sx={{ mt: 0 }}>
            {isCanEdit && (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      name="open_invite"
                      checked={isOpenInvite}
                      inputProps={{ 'aria-label': 'controlled' }}
                      onChange={handleSwitchChange('openInvite')}
                    />
                  }
                  label="Allow anyone in the conversation to invite others"
                  sx={sxFormLabelProps}
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="conversation_open"
                      checked={isLockConversation}
                      inputProps={{ 'aria-label': 'controlled' }}
                      onChange={handleSwitchChange('openConversation')}
                    />
                  }
                  label="Lock conversation (no responses will be allowed)"
                  sx={sxFormLabelProps}
                />
              </>
            )}
            {/* <FormControlLabel
              control={
                <Switch
                  name="notifications"
                  checked={isShowNotifications}
                  inputProps={{ 'aria-label': 'controlled' }}
                  defaultChecked={isShowNotifications}
                />
              }
              label="Notifications"
              sx={sxFormLabelProps}
            /> */}
            <FormControlLabel
              control={
                <Switch
                  name="star"
                  checked={isStared}
                  inputProps={{ 'aria-label': 'controlled' }}
                  onChange={handleSwitchChange('star')}
                />
              }
              label="Stared"
              sx={sxFormLabelProps}
            />
            <FormControlLabel
              control={
                <Switch
                  name="unread"
                  checked={isUnread}
                  inputProps={{ 'aria-label': 'controlled' }}
                  onChange={handleSwitchChange('unread')}
                />
              }
              label="Unread"
              sx={sxFormLabelProps}
            />
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        {isOwner ? (
          <Button
            sx={{ ...sxButton, ml: 0, mr: 'auto' }}
            color="error"
            variant="contained"
            onClick={openRemoveDialog}
          >
            Remove
          </Button>
        ) : (
          <Button
            sx={{ ...sxButton, ml: 0, mr: 'auto' }}
            color="error"
            variant="outlined"
            onClick={openLeaveDialog}
          >
            Leave
          </Button>
        )}
        <Button sx={sxButton} variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button sx={sxButton} variant="contained" type="submit">
          Update
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

export default SettingsRoomForm
