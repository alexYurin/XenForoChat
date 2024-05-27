import BaseModel from './BaseModel'

export type AttachmentModelType = {
  id: number
  name: string
  thumbnailUrl?: string
  url: string
  size: number
  type: string
  createdAt: Date
}

export default class Attachment extends BaseModel<AttachmentModelType> {
  constructor(model: AttachmentModelType) {
    super(model)
  }
}
