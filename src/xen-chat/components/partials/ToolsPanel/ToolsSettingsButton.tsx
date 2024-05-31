import { Button, styled, SxProps } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useChatStore } from '@app/store'

const ToolsSettingsButton = () => {
  const currentRoom = useChatStore(state => state.currentRoom)

  const setVisibleSettingsForm = useChatStore(
    state => state.setVisibleSettingsRoomForm,
  )

  const onPress = () => {
    setVisibleSettingsForm(currentRoom)
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

  const StyledButton = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  }))

  return (
    <StyledButton onClick={onPress} size="small" sx={sxButton}>
      <InfoOutlinedIcon sx={{ width: 24, height: 24 }} />
    </StyledButton>
  )
}

export default ToolsSettingsButton
