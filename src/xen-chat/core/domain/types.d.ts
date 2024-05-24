export type PermissionsType = {
  isCanEdit: boolean
  isCanReply: boolean
  isCanInvite: boolean
  isCanReact: boolean
  isCanUploadAttachment: boolean
}

export type ErrorType = {
  message: string
  trace?: string
}
