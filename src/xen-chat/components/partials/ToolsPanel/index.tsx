import {
  Paper,
  Box,
  IconButton,
  styled,
  Typography,
  SxProps,
} from '@mui/material'
import { AvatarExt, AvatarGroupExt } from '@app/components/ui'
import ToolsMenuButton from './ToolsMenuButton'
import ToolsSettingsButton from './ToolsSettingsButton'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { sxButton } from '@app/themes/components/button'
import { useChatStore } from '@app/store'
import { XenChatMode } from '@app/enums'
import { RefObject } from 'react'

export type ToolsPanelProps = {
  elRef?: RefObject<HTMLDivElement>
  isShowBackButton?: boolean
  closeHandler: () => void
}

const ToolsPanel = ({
  elRef,
  isShowBackButton,
  closeHandler,
}: ToolsPanelProps) => {
  const mode = useChatStore(state => state.mode)
  const currentRoom = useChatStore(state => state.currentRoom)

  const sxTitle: SxProps = {
    display: 'inline-block',
    textOverflow: 'ellipsis',
  }

  const titleSize = currentRoom?.model.note ? 14 : 18
  const avatarSize = currentRoom?.model.note ? 55 : 50
  const minHeight = currentRoom?.model.note ? 'unset' : 81

  const title = (
    <Box display="flex" flexDirection="column">
      <Typography noWrap fontSize={titleSize} fontWeight={500} sx={sxTitle}>
        {currentRoom?.model.title}
      </Typography>
      {currentRoom?.model.note && (
        <Typography noWrap fontSize={12} color="#f47d02" sx={sxTitle}>
          {currentRoom?.model.note}
        </Typography>
      )}
    </Box>
  )

  const members = (
    <AvatarGroupExt
      items={
        currentRoom?.model.members.map(member => ({
          id: member.model.id,
          label: member.model.name,
          src: member.model.avatar,
          href: member.model.link,
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
    <Paper
      ref={elRef}
      elevation={0}
      sx={{ display: 'flex', alignItems: 'center', width: '100%', minHeight }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
          label={title}
          isStared={currentRoom?.model.isStared}
          badgeCount={currentRoom?.model.isUnread ? 1 : 0}
          avatarBadgeVariant="dot"
          description={members}
          sxAvatar={{ width: avatarSize, height: avatarSize }}
          sxLabel={{ fontSize: 18 }}
          hiddenAvatar={mode === XenChatMode.POPUP}
          hiddenAvatarXS={true}
          sx={{
            flexGrow: 1,
            paddingX: 1.4,
            paddingY: 1.12,
            width: 'calc(100% - 64px)',
          }}
        >
          {mode === XenChatMode.BASIC && <ToolsSettingsButton />}
          <ToolsMenuButton />
        </AvatarExt>
      </Box>
    </Paper>
  )
}

export default ToolsPanel
