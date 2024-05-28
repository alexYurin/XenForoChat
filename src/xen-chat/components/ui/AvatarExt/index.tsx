import {
  Paper,
  Stack,
  Avatar,
  Box,
  Typography,
  SxProps,
  Badge,
  styled,
} from '@mui/material'
import { stringToColor, stringToInitials } from '@app/helpers'
import { StyledBadge } from './styles'
import StarPurple500OutlinedIcon from '@mui/icons-material/StarPurple500Outlined'

// @TODO Decompose

export type AvatarExtProps = {
  src?: string
  badgeCount?: number
  label?: React.ReactNode | string
  avatarText?: string
  avatarBadgeVariant?: 'dot' | 'standard'
  description?: React.ReactNode | string
  isOnline?: boolean
  isStared?: boolean
  noWrap?: boolean
  sx?: SxProps
  hiddenAvatar?: boolean
  hiddenAvatarXS?: boolean
  sxAvatar?: SxProps
  sxLabel?: SxProps
  children?: React.ReactNode
}

const AvatarExt = ({
  src,
  badgeCount,
  label,
  avatarText,
  avatarBadgeVariant,
  description,
  isOnline,
  isStared,
  noWrap,
  sx,
  hiddenAvatar,
  hiddenAvatarXS,
  sxAvatar,
  sxLabel,
  children,
}: AvatarExtProps) => {
  const HiddenXSBadge = styled(Badge)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      display: hiddenAvatarXS ? 'none' : 'flex',
    },
  }))

  const avatar = (
    <HiddenXSBadge
      badgeContent={badgeCount}
      overlap="circular"
      variant={avatarBadgeVariant || 'standard'}
      color="error"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Avatar
        src={src}
        alt="username"
        sx={{
          width: 36,
          height: 36,
          // ...(typeof label === 'string'
          //   ? { bgcolor: stringToColor(avatarText || label) }
          //   : {}),
          ...sxAvatar,
        }}
      >
        {stringToInitials(avatarText || `${label}` || '')}
      </Avatar>
    </HiddenXSBadge>
  )

  const avatarWithOnline = isOnline ? (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      {avatar}
    </StyledBadge>
  ) : (
    avatar
  )

  const avatarWithStared = isStared ? (
    <HiddenXSBadge
      overlap="circular"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      badgeContent={
        <StarPurple500OutlinedIcon
          sx={{
            p: 0.2,
            borderRadius: '50%',
            bgcolor: '#fff',
            color: '#FDCA47',
          }}
        />
      }
    >
      {avatarWithOnline}
    </HiddenXSBadge>
  ) : (
    avatarWithOnline
  )

  const labelElement =
    typeof label === 'string' ? (
      <Typography
        noWrap={noWrap || true}
        variant="h5"
        component="h2"
        sx={{ fontWeight: 500, ...sxLabel }}
      >
        {label}
      </Typography>
    ) : (
      label
    )

  const descriptionElement =
    description && typeof description === 'string' ? (
      <Typography
        noWrap={noWrap || true}
        variant="h6"
        component="p"
        mt={0.5}
        sx={{ fontWeight: 400 }}
      >
        {description}
      </Typography>
    ) : (
      description
    )

  if (label) {
    return (
      <Paper elevation={0} sx={{ paddingX: 2, paddingY: 2, ...sx }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ position: 'relative', alignItems: 'center', width: '100%' }}
        >
          {!hiddenAvatar && avatarWithStared}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 100%',
              mr: 2,
              maxWidth: 'calc(100% - 36px)',
              overflow: 'hidden',
            }}
          >
            {labelElement}
            {descriptionElement}
          </Box>

          {children}
        </Stack>
      </Paper>
    )
  }

  return avatarWithStared
}

export default AvatarExt
