import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Paper,
  Typography,
} from '@mui/material'
import { isImage } from './helpers'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

export type DisplayAttachmentsProps = {
  isVisible: boolean
  title?: string
  isLoading: boolean
  files: File[]
  children?: React.ReactNode
  onCancel: () => void
  onRemove: (file: File) => void
}

const DisplayAttachments = ({
  isVisible,
  title,
  isLoading,
  files,
  children,
  onCancel,
  onRemove,
}: DisplayAttachmentsProps) => {
  const renderFile = (file: File) => {
    if (isImage(file)) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          loading="lazy"
          style={{ width: 200, height: 150, objectFit: 'cover' }}
        />
      )
    }

    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ width: 200, height: 150, bgcolor: '#fff' }}
      >
        <InsertDriveFileOutlinedIcon
          sx={{ color: 'GrayText', width: 48, height: 48 }}
        />
        <Typography fontSize={12} fontWeight={500}>
          {file.type}
        </Typography>
      </Box>
    )
  }

  const renderAttachments = () => {
    if (files.length === 0) {
      return null
    }

    return (
      <Box
        gap={1}
        sx={{
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'center',
          m: 0,
          p: 1,
          maxHeight: '230px',
          overflowY: 'auto',
        }}
      >
        {files.map(file => {
          const convertedFileSize =
            (file.size / (1024 * 1024)).toFixed(2) + 'Mb'

          const removeFile = () => onRemove(file)

          return (
            <ImageListItem
              key={`${file.name.replace(' ', '_')}`}
              sx={{
                borderRadius: '26px',
                overflow: 'hidden',
              }}
            >
              {renderFile(file)}
              <ImageListItemBar
                title={file.name}
                subtitle={convertedFileSize}
                position="top"
                actionIcon={
                  <IconButton
                    onClick={removeFile}
                    sx={{
                      marginX: 1,
                      bgcolor: '#888888f',
                      color: 'rgba(255, 255, 255, 1)',
                    }}
                    aria-label={`${file.name}`}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ width: 20, height: 20 }} />
                  </IconButton>
                }
                actionPosition="right"
                sx={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                  '& .MuiImageListItemBar-title': {
                    fontWeight: 500,
                    fontSize: 12,
                  },
                  '& .MuiImageListItemBar-subtitle': {
                    fontWeight: 500,
                    fontSize: 10,
                  },
                }}
              />
            </ImageListItem>
          )
        })}
      </Box>
    )
  }

  if (isVisible) {
    return (
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          left: 0,
          bottom: '100%',
          width: '100%',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          bgcolor: '#fff',
          boxShadow: '0 -5px 35px -5px rgba(0, 0, 0, 0.14)',
          zIndex: 2,
        }}
      >
        <ListSubheader
          component="div"
          sx={{
            display: 'flex',
            p: 0,
            paddingX: 2,
            gap: 1,
            width: '100%',
            fontSize: 14,
          }}
        >
          {title || `Attachments: ${files.length}`}
          <IconButton
            color="primary"
            onClick={onCancel}
            sx={{ ml: 'auto', alignSelf: 'center' }}
          >
            <CloseOutlinedIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </ListSubheader>

        {renderAttachments()}
        {children}

        <Backdrop
          sx={{
            position: 'absolute',
            color: '#fff',
            zIndex: theme => theme.zIndex.drawer + 1,
          }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Paper>
    )
  }

  return null
}

export default DisplayAttachments
