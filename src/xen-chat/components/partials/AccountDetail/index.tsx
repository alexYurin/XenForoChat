import { RefObject } from 'react'
import { Button, Box, Typography, Skeleton } from '@mui/material'
import { AvatarExt } from '@app/components/ui'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { useChatStore } from '@app/store'
import { sxButton } from '@app/themes/components/button'

export type AccountDetailProps = {
  elRef?: RefObject<HTMLDivElement>
}

const AccountDetail = ({ elRef }: AccountDetailProps) => {
  const isReady = useChatStore(state => state.isReady)
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
    <div ref={elRef}>
      {isReady ? (
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
      ) : (
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ paddingX: 1.4, paddingY: 1.13, pr: 3 }}
        >
          <Skeleton variant="circular" width={50} height={50} />
          <Skeleton variant="rounded" width={100} height={20} />
          <Skeleton
            variant="rounded"
            width={50}
            height={20}
            sx={{ ml: 'auto' }}
          />
        </Box>
      )}
    </div>
  )
}

export default AccountDetail
