import BaseModel from './BaseModel'
import Member from './Member'
import Message, { MessageModelType } from './Message'
import type { PermissionsType } from './types'

export type RoomModelType = {
  id: number
  title: string
  isOwner: boolean
  createdAt: Date
  isStared: boolean
  isUnread: boolean
  isOpenInvite: boolean
  isOpenConversation: boolean
  members: Member[]
  owner: Member
  firstMessageId: MessageModelType['id']
  lastMessageId: MessageModelType['id']
  lastMessageDate: Date
  lastMessage?: Message
  lastPageNumber: number
  permissions: Omit<PermissionsType, 'isCanReact'>
}

export default class Room extends BaseModel<RoomModelType> {
  constructor(model: RoomModelType) {
    super(model)
  }
}
