import { Attachment } from '@app/core/domain'
import { Box, Button, Typography } from '@mui/material'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'

export type AttachmentPreviewProps = {
  detail: Attachment
}

const AttachmentPreview = ({ detail }: AttachmentPreviewProps) => {
  const title = (
    <Button
      component="a"
      href={`data:${detail.model.url}`}
      download={detail.model.name}
      sx={{ mt: 0.5, p: 0.5, gap: 0.5 }}
    >
      <CloudDownloadOutlinedIcon />
      <Typography
        sx={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          maxWidth: '120px',
          overflow: 'hidden',
        }}
      >
        {detail.model.name}
      </Typography>
    </Button>
  )

  if (detail.model.thumbnailUrl) {
    return (
      <Box display="flex" flexDirection="column" flex={1}>
        <Button
          component="a"
          href={detail.model.url}
          target="_blank"
          title={detail.model.name}
          sx={{ p: 0 }}
        >
          <img
            src={detail.model.thumbnailUrl}
            alt={detail.model.name}
            style={{
              width: '100%',
              minWidth: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: '16px',
            }}
          />
        </Button>
        {title}
      </Box>
    )
  }

  return title
}

export default AttachmentPreview
