import { RefObject, useState } from 'react'
import {
  Paper,
  Box,
  IconButton,
  styled,
  Typography,
  SxProps,
  Button,
  ButtonGroup,
} from '@mui/material'
import { AvatarExt, AvatarGroupExt } from '@app/components/ui'
import ToolsMenuButton from './ToolsMenuButton'
import ToolsSettingsButton from './ToolsSettingsButton'
import ActionDialog from './ActionDialog'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { sxButton } from '@app/themes/components/button'
import { useChatStore } from '@app/store'
import { XenChatMode } from '@app/enums'
import { RoomModelType } from '@app/core/domain/Room'

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

  const [action, setAction] = useState<RoomModelType['actions'][0] | null>(null)

  const sxTitle: SxProps = {
    display: 'inline-block',
    textOverflow: 'ellipsis',
    fontSize: 15,
  }

  const avatarSize = currentRoom?.model.note ? 55 : 50
  const minHeight = 88

  const handleCloseActionDialog = () => {
    setAction(null)
  }

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
      size={18}
    />
  )

  const actions = (
    <ButtonGroup
      variant="text"
      size="small"
      sx={{
        ml: 'auto',
        transform: 'translateY(2px)',
        '& .MuiButtonBase-root': { borderColor: 'transparent' },
      }}
    >
      {currentRoom?.model.actions.map(action => {
        return (
          <Button
            component="a"
            href={`${action.url}?_back=${window.location.pathname}`}
            target={action.isTargetBlank ? '_blank' : undefined}
            onClick={event => {
              if (action.confirmation) {
                event.preventDefault()

                setAction(action)
              }
            }}
            sx={{
              whiteSpace: 'nowrap',
              fontSize: '0.8rem',
            }}
          >
            {action.title}
          </Button>
        )
      })}
    </ButtonGroup>
  )

  const title = (
    <Box display="flex" flexDirection="column">
      <Typography noWrap fontWeight={500} sx={sxTitle}>
        {currentRoom?.model.title}
      </Typography>
    </Box>
  )

  const StyledBackButton = styled(IconButton)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      display: 'inline-flex',
      marginLeft: 11.2,
      marginRight: mode === XenChatMode.POPUP ? 0 : -16,
    },
  }))

  return (
    <>
      <Paper
        ref={elRef}
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: minHeight,
        }}
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
            avatarText={currentRoom?.model.title}
            isStared={currentRoom?.model.isStared}
            src={currentRoom?.model.owner.model.avatar}
            badgeCount={currentRoom?.model.isUnread ? 1 : 0}
            avatarBadgeVariant="dot"
            description={
              <Box display="flex" flexDirection="column">
                {members}
                {currentRoom?.model.note && (
                  <Typography
                    noWrap
                    mt={0.5}
                    color="#f47d02"
                    sx={{
                      ...sxTitle,
                      fontSize: 11,
                      visibility: currentRoom?.model.note
                        ? 'visible'
                        : 'hidden',
                    }}
                  >
                    {currentRoom?.model.note || 'Empty'}
                  </Typography>
                )}
              </Box>
            }
            sxAvatar={{ width: avatarSize, height: avatarSize }}
            sxLabel={{ fontSize: 18 }}
            hiddenAvatar={mode === XenChatMode.POPUP}
            hiddenAvatarXS={true}
            sx={{
              flexGrow: 1,
              paddingX: 1.4,
              paddingY: 1.12,
              width: XenChatMode.POPUP
                ? 'calc(100% - 193px)'
                : 'calc(100% - 177px)',
            }}
          />
          <Box display="flex" alignItems="center" ml="auto" pr={1.4}>
            <Box
              display="flex"
              flexDirection="column"
              gap={0.5}
              sx={{ flexFlow: 'row nowrap', alignItems: 'center' }}
            >
              {actions}
            </Box>
            {mode === XenChatMode.BASIC && <ToolsSettingsButton />}
            <ToolsMenuButton />
          </Box>
        </Box>
      </Paper>
      <ActionDialog detail={action} handleClose={handleCloseActionDialog} />
    </>
  )
}

export default ToolsPanel
