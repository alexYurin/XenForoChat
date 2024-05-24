import { Paper, Box, IconButton, styled } from '@mui/material'
import { AvatarExt, AvatarGroupExt } from '@app/components/ui'
import ToolsMenuButton from './ToolsMenuButton'
import ToolsSettingsButton from './ToolsSettingsButton'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { sxButton } from '@app/themes/components/button'
import { useChatStore } from '@app/store'
import { XenChatMode } from '@app/enums'

export type ToolsPanelProps = {
  isShowBackButton?: boolean
  closeHandler: () => void
}

const ToolsPanel = ({ isShowBackButton, closeHandler }: ToolsPanelProps) => {
  const mode = useChatStore(state => state.mode)
  const currentRoom = useChatStore(state => state.currentRoom)

  const members = (
    <AvatarGroupExt
      items={
        currentRoom?.model.members.map(member => ({
          id: member.model.id,
          label: member.model.name,
        })) || []
      }
      max={4}
      size={20}
    />
  )

  const StyledBackButton = styled(IconButton)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      display: 'inline-flex',
      marginLeft: 11.2,
      marginRight: mode === XenChatMode.POPUP ? 0 : -16,
    },
  }))

  return (
    <Paper elevation={0} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledBackButton
          sx={{
            ...sxButton,
            display: isShowBackButton ? 'inline-flex' : 'none',
            ml: mode === XenChatMode.POPUP ? '11.2px' : 1.4,
            mr: 0,
          }}
          onClick={closeHandler}
        >
          <ArrowBackIosNewOutlinedIcon />
        </StyledBackButton>
        <AvatarExt
          label={currentRoom?.model.title}
          isStared={currentRoom?.model.isStared}
          badgeCount={currentRoom?.model.isUnread ? 1 : 0}
          avatarBadgeVariant="dot"
          description={members}
          sxAvatar={{ width: 50, height: 50 }}
          sxLabel={{ fontSize: 18 }}
          hiddenAvatar={mode === XenChatMode.POPUP}
          hiddenAvatarXS={true}
          sx={{ paddingX: 1.4, paddingY: 1.12, width: '100%' }}
        >
          {mode === XenChatMode.BASIC && <ToolsSettingsButton />}
          <ToolsMenuButton />
        </AvatarExt>
      </Box>
    </Paper>
  )
}

export default ToolsPanel
