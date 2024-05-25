import {
  Backdrop,
  Box,
  Button,
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

export type DisplayAttachmentsProps = {
  isLoading: boolean
  files: File[]
  onCancel: () => void
  onRemove: (file: File) => void
}

const DisplayAttachments = ({
  isLoading,
  files,
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

  if (files.length === 0) {
    return null
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        left: 0,
        bottom: '100%',
        width: '100%',
        borderRadius: '36px 36px 0 0',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
      <ListSubheader
        component="div"
        sx={{
          gap: 1,
          width: '100%',
          textAlign: 'center',
          fontSize: 14,
        }}
      >
        {`Attachments: ${files.length}`}
        <Button
          onClick={onCancel}
          sx={{ ml: 1, borderRadius: '12px', fontSize: 11 }}
        >
          Cancel
        </Button>
      </ListSubheader>
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

export default DisplayAttachments
