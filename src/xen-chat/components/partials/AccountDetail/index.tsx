import { Button, Box, Typography } from '@mui/material'
import { AvatarExt } from '@app/components/ui'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { useChatStore } from '@app/store'
import { sxButton } from '@app/themes/components/button'

const AccountDetail = () => {
  const user = useChatStore(state => state.user)
  const setVisibleAddForm = useChatStore(state => state.setVisibleAddRoomForm)

  const onPressAddButton = () => {
    setVisibleAddForm(true)
  }

  const titleElement = (
    <Box sx={{ display: 'flex', flexFlow: 'nowrap' }}>
      <Typography noWrap={true} sx={{ fontSize: 18, fontWeight: 500 }}>
        {user?.username}
      </Typography>
    </Box>
  )

  return (
    <AvatarExt
      isOnline
      src={user?.avatar_urls[0]}
      avatarText={user?.username}
      label={titleElement}
      sx={{ paddingX: 1.4, paddingY: 1.13, pr: 1 }}
      sxAvatar={{ width: 50, height: 50 }}
    >
      <Button
        aria-label="Create"
        size="large"
        sx={sxButton}
        onClick={onPressAddButton}
      >
        <PlaylistAddIcon sx={{ mr: 0.8, width: 20, height: 20 }} />
        Add
      </Button>
    </AvatarExt>
  )
}

export default AccountDetail
