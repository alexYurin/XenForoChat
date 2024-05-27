import { stringToColor, stringToInitials } from '@app/helpers'
import { Avatar, AvatarGroup, Box, SxProps, Typography } from '@mui/material'

export type AvatarGroupExtItem = {
  label: string
  src?: string
  href?: string
}

export type AvatarGroupExtProps = {
  items: AvatarGroupExtItem[]
  max?: number
  size?: number
  spacing?: 'small'
  sx?: SxProps
}

const AvatarGroupExt = ({
  items,
  max,
  size,
  spacing,
  sx,
}: AvatarGroupExtProps) => {
  return (
    <AvatarGroup
      renderSurplus={surplus => <span>+</span>}
      spacing={spacing}
      total={items.length}
      max={max}
      sx={{
        justifyContent: 'flex-end',
        '& .MuiAvatar-root': {
          width: size,
          height: size,
          fontSize: '1rem',
        },
        ...sx,
      }}
    >
      {items.map((item, index) => (
        <Avatar
          key={index}
          src={item.src}
          alt={item.label}
          component="a"
          href={item.href}
          target="_blank"
          title={item.label}
          sx={{
            width: size,
            height: size,
            bgcolor: stringToColor(item.label),
            textDecoration: 'none',
          }}
        >
          {stringToInitials(item.label)}
        </Avatar>
      ))}
    </AvatarGroup>
  )
}

export default AvatarGroupExt
