import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { XenforoApi } from '@app/api/xenforo'
import {
  adoptAttachment,
  adoptMessage,
  adoptRoom,
} from '@app/adapters/xenForoApi'
import { Room, Message, Attachment } from '@app/core/domain'
import {
  RequestParamsAddConversation,
  RequestParamsSearchConversation,
  RequestParamsUpdateConversation,
  ResponseFindUsernameType,
  ResponseSuccessType,
  UserType,
} from '@app/api/xenforo/types'

export interface XenForoApiState {
  api: XenforoApi
  apiUrl: string | null
  fetchMe: () => Promise<UserType>
  findUser: (username: string) => Promise<ResponseFindUsernameType>
  token: string | null
  updateApiUrl: (apiUrl: string) => void
  updateToken: (token: string) => void
  generateSecureRoomKey: (roomID: number) => Promise<string | undefined>
  fetchRoomMessages: (
    roomId: number,
    page: number,
    securityKey?: string,
  ) => Promise<{
    messages: Message[]
    pagination: { lastPage: number; currentPage: number; total: number }
  }>
  sendMessage: (
    roomId: number,
    message: string,
    key?: string,
  ) => Promise<Message>
  editMessage: (
    messageId: number,
    message: string,
    key?: string,
  ) => Promise<Message>
  replyMessage: (
    roomId: number,
    messageId: number,
    message: string,
  ) => Promise<Message>
  fetchRooms: (params?: RequestParamsSearchConversation) => Promise<{
    rooms: Room[]
    pagination: { lastPage: number; currentPage: number; total: number }
  }>
  getRoom: (roomId: number) => Promise<{
    room: Room
    messages: Message[]
    pagination: { lastPage: number; currentPage: number; total: number }
  }>
  addRoom: (params: RequestParamsAddConversation) => Promise<Room>
  updateRoom: (
    roomId: number,
    params: RequestParamsUpdateConversation,
  ) => Promise<Room>
  inviteRoom: (
    roomId: number,
    usersIds: number[],
  ) => Promise<ResponseSuccessType>
  noteRoom: (roomId: number, test: string) => Promise<Room>
  leaveRoom: (
    roomId: number,
    params: { ignore: boolean },
  ) => Promise<ResponseSuccessType>
  starRoom: (roomId: number, isStared?: boolean) => Promise<ResponseSuccessType>
  readRoom: (roomId: number, unixTime: number) => Promise<ResponseSuccessType>
  unreadRoom: (roomId: number) => Promise<ResponseSuccessType>
  createMessageAttachmentKey: (
    messageId: number,
    attachment?: File,
  ) => Promise<{ key: string; attachment?: Attachment }>
  attachFile: (key: string, file: File) => Promise<Attachment>
}

const useXenForoApiStore = create<XenForoApiState>()(
  devtools(
    (set, get) => ({
      api: new XenforoApi(),

      fetchMe: () => {
        return get()
          .api.user.me()
          .then(response => response.data.me)
      },

      findUser: username => {
        return get()
          .api.user.find(username)
          .then(response => response.data)
      },

      apiUrl: null,

      updateApiUrl: apiUrl =>
        set(() => {
          get().api.updateApiUrl(apiUrl)

          return { apiUrl }
        }),

      token: null,

      updateToken: token =>
        set(() => {
          get().api.updateToken(token)

          return { token }
        }),

      generateSecureRoomKey: roomId => {
        return get()
          .api.conversations.postSecurityKey(roomId)
          .then(response => response.data.conversation_secure_key)
      },

      fetchRoomMessages: (roomId, page, securityKey) => {
        return get()
          .api.conversations.getMessages(roomId, {
            page,
            ...(securityKey ? { conversation_key: securityKey } : {}),
          })
          .then(response => ({
            messages: response.data.messages.map(message =>
              adoptMessage(message),
            ),
            pagination: {
              currentPage: response.data.pagination.current_page,
              lastPage: response.data.pagination.last_page,
              total: response.data.pagination.total,
            },
          }))
      },

      sendMessage: (roomId, message, key) => {
        return get()
          .api.conversationMessages.send({
            conversation_id: roomId,
            message,
            attachment_key: key,
          })
          .then(response => adoptMessage(response.data.message))
      },

      editMessage: (messageId, message, key) => {
        return get()
          .api.conversationMessages.update(messageId, {
            message,
            attachment_key: key,
          })
          .then(response => adoptMessage(response.data.message))
      },

      replyMessage: (roomId, messageId, message) => {
        return get()
          .api.conversationMessages.reply(roomId, message, messageId)
          .then(response => adoptMessage(response.data.message))
      },

      fetchRooms: params => {
        return get()
          .api.conversations.getAll(params)
          .then(response => ({
            rooms: response.data.conversations.map(conversation =>
              adoptRoom(conversation),
            ),
            pagination: {
              currentPage: response.data.pagination.current_page,
              lastPage: response.data.pagination.last_page,
              total: response.data.pagination.total,
            },
          }))
      },

      getRoom: roomId => {
        return get()
          .api.conversations.get(roomId)
          .then(response => ({
            room: adoptRoom(response.data.conversation),
            messages: response.data.messages.map(message =>
              adoptMessage(message),
            ),
            pagination: {
              currentPage: response.data.pagination.current_page,
              lastPage: response.data.pagination.last_page,
              total: response.data.pagination.total,
            },
          }))
      },

      addRoom: params => {
        return get()
          .api.conversations.create(params)
          .then(response => adoptRoom(response.data.conversation))
      },

      updateRoom: (roomId, params) => {
        return get()
          .api.conversations.update(roomId, params)
          .then(response => adoptRoom(response.data.conversation))
      },

      leaveRoom: (roomId, params) => {
        return get()
          .api.conversations.delete(roomId, params)
          .then(response => response.data)
      },

      noteRoom: (roomId, text) => {
        return get()
          .api.conversations.note(roomId, { note: text })
          .then(response => adoptRoom(response.data.conversation))
      },

      inviteRoom: (roomId, usersIds) => {
        return get()
          .api.conversations.invite(roomId, {
            recipient_ids: usersIds,
          })
          .then(response => response.data)
      },

      starRoom: (roomId, isStared) => {
        return get()
          .api.conversations.star(
            roomId,
            isStared ? { star: isStared } : undefined,
          )
          .then(response => response.data)
      },

      readRoom: (roomId, unixTime) => {
        return get()
          .api.conversations.markRead(roomId, { date: unixTime })
          .then(response => response.data)
      },

      unreadRoom: roomId => {
        return get()
          .api.conversations.markUnread(roomId)
          .then(response => response.data)
      },

      attachFile: (key: string, file: File) => {
        return get()
          .api.attachments.upload({ key, attachment: file })
          .then(response => adoptAttachment(response.data.attachment))
      },

      createMessageAttachmentKey: (messageId: number, attachment?: File) => {
        return get()
          .api.attachments.newKey({
            attachment,
            messageId,
            type: 'conversation_message',
          })
          .then(response => ({
            key: response.data.key,
            attachment: response.data.attachment
              ? adoptAttachment(response.data.attachment)
              : undefined,
          }))
      },
    }),
    {
      name: 'xenforo-api',
    },
  ),
)

export default useXenForoApiStore
