import BaseModel from './BaseModel'
import Member from './Member'
import Attachment from './Attachment'
import type { RoomModelType } from './Room'
import type { PermissionsType } from './types'

export type MessageModelType = {
  id: number
  text: string
  textParsed: string
  isAuthor: boolean
  isUnread: boolean
  permissions: Pick<PermissionsType, 'isCanEdit' | 'isCanReact'>
  roomId: RoomModelType['id']
  member: Member
  attachments: Attachment[]
  createAt: Date
}

export default class Message extends BaseModel<MessageModelType> {
  constructor(model: MessageModelType) {
    super(model)
  }
}
