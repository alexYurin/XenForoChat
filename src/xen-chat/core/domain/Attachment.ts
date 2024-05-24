import BaseModel from './BaseModel'

export type AttachmentModelType = {
  id: number
  name: string
  url: string
  size: number
  type: string
}

export default class Attachment extends BaseModel<AttachmentModelType> {
  constructor(model: AttachmentModelType) {
    super(model)
  }
}
