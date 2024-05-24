import { Box, SxProps, Typography } from '@mui/material'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'

export type EmptyProps = {
  text: string
  sx?: SxProps
  icon?: React.ReactNode | string
  children?: React.ReactNode
}

const Empty = ({ text, sx, icon, children }: EmptyProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      justifySelf="center"
      alignSelf="center"
      mt={-1}
      paddingX={2}
      paddingY={1}
      sx={sx}
    >
      {icon || typeof icon === 'string' ? (
        icon
      ) : (
        <ErrorOutlineOutlinedIcon
          sx={{ mb: 0.5, width: 38, height: 38, color: '#ddd' }}
        />
      )}
      <Typography mb={1.5} fontSize={14} textAlign="center" color="GrayText">
        {text}
      </Typography>
      {children}
    </Box>
  )
}

export default Empty
