import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SxProps,
} from '@mui/material'
import { useChatStore } from '@app/store'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined'

export type AccountMenuProps = {
  anchorElement: HTMLElement | null
  isOpen: boolean
  onClose: () => void
}

// @TODO Decompose
// @TODO Connect actions

const ToolsMenu = ({ anchorElement, isOpen, onClose }: AccountMenuProps) => {
  const user = useChatStore(state => state.user)

  const currentRoom = useChatStore(state => state.currentRoom)

  const setStarRoom = useChatStore(state => state.setStarRoom)

  const setUnreadRoom = useChatStore(state => state.setUnreadRoom)

  const setVisibleSettings = useChatStore(
    state => state.setVisibleSettingsRoomForm,
  )

  const setVisibleLeave = useChatStore(state => state.setVisibleLeaveRoomDialog)

  const setVisibleRemove = useChatStore(
    state => state.setVisibleRemoveRoomDialog,
  )

  const onPressStar = () => {
    if (currentRoom) {
      setStarRoom(currentRoom?.model.id, !currentRoom?.model.isStared)
      onClose()
    }
  }

  const onPressRead = () => {
    if (currentRoom) {
      setUnreadRoom(currentRoom?.model.id, !currentRoom?.model.isUnread)
      onClose()
    }
  }

  const onPressSettings = () => {
    setVisibleSettings(currentRoom)
    onClose()
  }

  const onPressLeave = () => {
    setVisibleLeave(currentRoom)
    onClose()
  }

  const onPressRemove = () => {
    setVisibleRemove(currentRoom)
    onClose()
  }

  const slotProps: SxProps = {
    paper: {
      elevation: 0,
      sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        p: 0,
        borderRadius: '12px',
        '& .MuiAvatar-root': {
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1,
          p: 0,
        },
        '& .MuiList-root': {
          p: 0,
          minWidth: '200px',
        },
        '& .MuiDivider-root': {
          marginY: 0,
        },
      },
    },
  }

  const sxItemProps: SxProps = {
    marginY: 0,
    paddingY: 1.5,
  }

  const sxIconProps: SxProps = {
    width: 24,
    height: 24,
  }

  const sxItemTextProps: SxProps = {
    '& .MuiTypography-root': {
      fontSize: 12,
      fontWeight: 500,
    },
  }

  const isStared = currentRoom?.model.isStared
  const isUnread = currentRoom?.model.isUnread

  const isOwner = currentRoom?.model.isOwner

  return (
    <Menu
      anchorEl={anchorElement}
      id="account-menu"
      open={isOpen}
      onClose={onClose}
      onClick={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      disablePortal
      slotProps={slotProps}
    >
      <MenuItem onClick={onPressStar} sx={sxItemProps}>
        <ListItemIcon>
          <StarBorderOutlinedIcon
            sx={{ ...sxIconProps, color: isStared ? '#FDCA47' : undefined }}
          />
        </ListItemIcon>
        <ListItemText sx={sxItemTextProps}>
          {isStared ? 'Unstar' : 'Star'}
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={onPressRead} sx={sxItemProps}>
        <ListItemIcon>
          {isUnread ? (
            <MarkEmailUnreadOutlinedIcon sx={sxIconProps} />
          ) : (
            <DraftsOutlinedIcon sx={sxIconProps} />
          )}
        </ListItemIcon>
        <ListItemText sx={sxItemTextProps}>
          {isUnread ? 'Mark read' : 'Mark unread'}
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onPressSettings} sx={sxItemProps}>
        <ListItemIcon>
          <InfoOutlinedIcon sx={sxIconProps} />
        </ListItemIcon>
        <ListItemText sx={sxItemTextProps}>Conversation</ListItemText>
      </MenuItem>
      <Divider />
      {isOwner ? (
        <MenuItem onClick={onPressRemove} sx={sxItemProps}>
          <ListItemIcon>
            <DeleteOutlinedIcon sx={sxIconProps} />
          </ListItemIcon>
          <ListItemText sx={sxItemTextProps}>Remove</ListItemText>
        </MenuItem>
      ) : (
        <MenuItem onClick={onPressLeave} sx={sxItemProps}>
          <ListItemIcon>
            <ExitToAppOutlinedIcon sx={sxIconProps} />
          </ListItemIcon>
          <ListItemText sx={sxItemTextProps}>Leave</ListItemText>
        </MenuItem>
      )}
    </Menu>
  )
}

export default ToolsMenu
