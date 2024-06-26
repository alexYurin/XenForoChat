import { RefObject } from 'react'
import { Button, Box, Typography, Skeleton } from '@mui/material'
import { AvatarExt } from '@app/components/ui'
import { useChatStore } from '@app/store'
import { sxButton } from '@app/themes/components/button'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'

export type AccountDetailProps = {
  elRef?: RefObject<HTMLDivElement>
}

const AccountDetail = ({ elRef }: AccountDetailProps) => {
  const isReady = useChatStore(state => state.isReady)
  const user = useChatStore(state => state.user)
  const rooms = useChatStore(state => state.rooms)
  const setVisibleAddForm = useChatStore(state => state.setVisibleAddRoomForm)

  const onPressAddButton = () => {
    setVisibleAddForm(true)
  }

  const titleElement = (
    <Box sx={{ display: 'flex', flexFlow: 'nowrap' }}>
      <Typography
        component="a"
        href={user?.view_url}
        target="blank"
        noWrap={true}
        sx={{
          fontSize: 18,
          fontWeight: 500,
          textDecoration: 'none',
          color: 'black',
        }}
      >
        {user?.username}
      </Typography>
    </Box>
  )

  const unreadRooms = rooms?.filter(room => room.model.isUnread)

  return (
    <div
      ref={elRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minHeight: '88px',
      }}
    >
      {isReady ? (
        <AvatarExt
          badgeCount={unreadRooms?.length}
          src={user?.avatar_urls.h}
          avatarText={user?.username}
          label={titleElement}
          description={
            <Typography fontSize={'1rem'}>{user?.user_title}</Typography>
          }
          sx={{ width: '100%', paddingX: 1.4, paddingY: 1.13, pr: 1 }}
          sxAvatar={{ width: 63, height: 63 }}
        >
          <Button
            aria-label="Create"
            size="large"
            sx={sxButton}
            onClick={onPressAddButton}
          >
            <PlaylistAddIcon sx={{ mr: 0.8, width: 20, height: 20 }} />
            <Typography
              fontSize={12}
              sx={{
                display: { xs: 'none', md: 'inline-block' },
              }}
            >
              Create
            </Typography>
          </Button>
        </AvatarExt>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          component="a"
          href={user?.view_url}
          sx={{
            paddingX: 1.4,
            paddingY: 1.13,
            pr: 3,
            width: '100%',
            cursor: 'pointer',
          }}
        >
          <Skeleton variant="circular" width={63} height={63} />
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
