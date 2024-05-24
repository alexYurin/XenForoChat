import { stringToColor, stringToInitials } from '@app/helpers'
import { Avatar, AvatarGroup, SxProps } from '@mui/material'

export type AvatarGroupExtItem = {
  label: string
  src?: string
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
          sx={{ width: size, height: size, bgcolor: stringToColor(item.label) }}
        >
          {stringToInitials(item.label)}
        </Avatar>
      ))}
    </AvatarGroup>
  )
}

export default AvatarGroupExt
