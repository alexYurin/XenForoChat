import { useState } from 'react'
import { Popover, ToggleButtonGroup, ToggleButton } from '@mui/material'

export type ReactionPanelProps = {
  id?: string
  isOpen: boolean
  anchorElement: HTMLDivElement | null
  handleClose: () => void
}

const ReactionPanel = ({
  id,
  isOpen,
  anchorElement,
  handleClose,
}: ReactionPanelProps) => {
  const [reaction, setReaction] = useState<string | null>(null)

  const handleReact = (
    event: React.MouseEvent<HTMLElement>,
    value: string | null,
  ) => {
    setReaction(value)
    handleClose()
  }

  return (
    <Popover
      id={id}
      open={isOpen}
      anchorEl={anchorElement}
      onClose={handleClose}
      disablePortal
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
          },
        },
      }}
    >
      <ToggleButtonGroup
        value={reaction}
        exclusive
        onChange={handleReact}
        aria-label="reaction"
      >
        <ToggleButton
          value="👍"
          aria-label="Like"
          sx={{ paddingX: 1, paddingY: 0, fontSize: 18 }}
        >
          👍
        </ToggleButton>
        <ToggleButton
          value="😍"
          aria-label="Love"
          sx={{ paddingX: 1, paddingY: 0, fontSize: 18 }}
        >
          😍
        </ToggleButton>
        <ToggleButton
          value="😂"
          aria-label="Haha"
          sx={{ paddingX: 1, paddingY: 0, fontSize: 18 }}
        >
          😂
        </ToggleButton>
        <ToggleButton
          value="😮"
          aria-label="Wow"
          sx={{ paddingX: 1, paddingY: 0, fontSize: 18 }}
        >
          😮
        </ToggleButton>
        <ToggleButton
          value="😔"
          aria-label="Sad"
          sx={{ paddingX: 1, paddingY: 0, fontSize: 18 }}
        >
          😔
        </ToggleButton>
        <ToggleButton
          value="😡"
          aria-label="Angry"
          sx={{ paddingX: 1, paddingY: 0, fontSize: 18 }}
        >
          😡
        </ToggleButton>
      </ToggleButtonGroup>
    </Popover>
  )
}

export default ReactionPanel
