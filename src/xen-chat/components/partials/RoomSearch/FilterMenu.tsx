import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SxProps,
} from '@mui/material'
import { useChatStore } from '@app/store'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'

export type FilterMenuProps = {
  anchorElement: HTMLElement | null
  isOpen: boolean
  onClose: () => void
  onPressUnread: () => void
}

// @TODO Decompose
// @TODO Connect actions

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

const FilterMenu = ({
  anchorElement,
  isOpen,
  onClose,
  onPressUnread,
}: FilterMenuProps) => {
  const searchFilter = useChatStore(state => state.searchFilter)

  const onUnread = () => {
    onPressUnread()
    onClose()
  }

  const isOnlyUnread = searchFilter.unread === '1'
  const color = isOnlyUnread ? '#ed6c02' : undefined

  return (
    <Menu
      anchorEl={anchorElement}
      id="filter-menu"
      open={isOpen}
      onClose={onClose}
      onClick={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      disablePortal
      slotProps={slotProps}
    >
      <MenuItem onClick={onUnread} sx={sxItemProps}>
        <ListItemIcon>
          <MarkEmailUnreadIcon sx={{ ...sxIconProps, color }} />
        </ListItemIcon>
        <ListItemText sx={{ ...sxItemTextProps, color }}>
          Show only unread
        </ListItemText>
      </MenuItem>
    </Menu>
  )
}

export default FilterMenu
