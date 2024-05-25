import { ChangeEventHandler, RefObject } from 'react'
import { Button, styled, SxProps } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'

export type AttachmentFileProps = {
  refInput?: RefObject<HTMLInputElement>
  disabled?: boolean
  sx?: SxProps
  sxIcon?: SxProps
  onChange: (files: FileList | null) => void
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const AttachmentFile = ({
  refInput,
  onChange,
  disabled,
  sx,
  sxIcon,
}: AttachmentFileProps) => {
  const onChangeInput: ChangeEventHandler<HTMLInputElement> = event => {
    const files = event.target.files

    onChange(files)
  }

  return (
    <Button component="label" disabled={disabled} variant="outlined" sx={sx}>
      <AttachFileIcon sx={sxIcon} />
      <VisuallyHiddenInput
        ref={refInput}
        type="file"
        onChange={onChangeInput}
        multiple
      />
    </Button>
  )
}

export default AttachmentFile
