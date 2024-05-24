import { useState } from 'react'
import { Button, SxProps } from '@mui/material'
import ToolsMenu from './ToolsMenu'
import MoreIcon from '@mui/icons-material/MoreVert'

const ToolsMenuButton = () => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)

  const onPress = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const onCloseToolsMenu = () => {
    setAnchorElement(null)
  }

  const sxButton: SxProps = {
    paddingX: 2,
    paddingY: '12px',
    minWidth: 'unset',
    borderRadius: '12px',
    borderWidth: 1,
    '&:hover': {
      borderWidth: 1,
    },
  }

  const isOpenToolsMenu = Boolean(anchorElement)

  return (
    <>
      <Button
        onClick={onPress}
        size="small"
        style={{ marginLeft: 'auto' }}
        sx={sxButton}
        aria-controls={isOpenToolsMenu ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpenToolsMenu ? 'true' : undefined}
      >
        <MoreIcon sx={{ width: 24, height: 24 }} />
      </Button>
      <ToolsMenu
        isOpen={isOpenToolsMenu}
        anchorElement={anchorElement}
        onClose={onCloseToolsMenu}
      />
    </>
  )
}

export default ToolsMenuButton
