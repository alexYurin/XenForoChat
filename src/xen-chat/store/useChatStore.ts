import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Message, Room } from '@app/core/domain'
import useXenForoApiStore from './useXenForoApiStore'
import { XenChatMode } from '@app/enums'
import type { ErrorType } from '@app/core/domain/types'
import type {
  RequestParamsAddConversation,
  RequestParamsSearchConversation,
  RequestParamsUpdateConversation,
  ResponseErrorType,
  UserType,
} from '@app/api/xenforo/types'
import { MessageModelType } from '@app/core/domain/Message'
import { adoptMember } from '@app/adapters/xenForoApi'
import { generateReplyMessage } from '@app/helpers'

const createError = (error: unknown): ErrorType => {
  if (Array.isArray((error as ResponseErrorType).errors)) {
    return {
      message: (error as ResponseErrorType).errors
        .map(er => er.message)
        .join(','),
    }
  }

  console.log(error)

  return { message: `${error}` }
}

// @TODO Decompose
// @TODO create selectors

export interface ChatState {
  isReady: boolean
  setReady: (isReady: boolean) => void
  handleApiUrl: (location: Location) => void
  inputMode: 'default' | 'reply' | 'edit'
  inputModeContent: MessageModelType | null
  setInputMode: (
    mode: 'default' | 'reply' | 'edit',
    inputModeContent: MessageModelType | null,
  ) => void
  mode: XenChatMode | null
  setMode: (mode: XenChatMode) => void
  fetchUser: () => Promise<void>
  error: ErrorType | null
  resetError: () => void
  user: UserType | null
  isLoadingMessages: boolean
  setLoadingMessages: (isLoading: boolean) => void
  isVisibleAddRoomForm: boolean
  setVisibleAddRoomForm: (isVisible: boolean) => void
  visibleSettingsRoomForm: Room | null
  setVisibleSettingsRoomForm: (room: Room | null) => void
  visibleLeaveRoomDialog: Room | null
  setVisibleLeaveRoomDialog: (room: Room | null) => void
  visibleRemoveRoomDialog: Room | null
  setVisibleRemoveRoomDialog: (room: Room | null) => void
  sendMessage: (
    roomId: number,
    message: string,
    files?: File[],
  ) => Promise<void>
  editMessage: (
    messageId: number,
    message: string,
    files?: File[],
  ) => Promise<void>
  replyMessage: (
    roomId: number,
    replyMessageModel: MessageModelType,
    text: string,
    files?: File[],
  ) => Promise<void>
  update: () => Promise<void>
  searchString: string
  rooms: Room[] | null
  getRooms: (params?: Partial<RequestParamsSearchConversation>) => Promise<void>
  currentRoom: Room | null
  resetCurrentRoom: () => void
  setCurrentRoom: (roomId: number, messagesPage?: number) => Promise<void>
  addNewRoom: (params: RequestParamsAddConversation) => Promise<void>
  updateRoom: (
    roomId: number,
    params: RequestParamsUpdateConversation,
  ) => Promise<void>
  inviteRoom: (roomId: number, users: UserType[]) => Promise<void>
  leaveRoom: (roomId: number) => Promise<void>
  currentRoomMessages: Message[] | null
  currentRoomMessagesPage: number
  lastCurrentRoomMessagesPage: number | null
  loadMoreCurrentRoomMessages: () => Promise<void>
  setStarRoom: (roomId: number, isStared: boolean) => Promise<void>
  setUnreadRoom: (roomId: number, isUnread: boolean) => Promise<void>
}

const useChatStore = create<ChatState>()(
  devtools(
    // persist(
    (set, get) => ({
      isReady: false,
      setReady: isReady => {
        set(() => ({ isReady }))
      },

      handleApiUrl: location => {
        const params = location.search.replace('?', '')?.split('/')

        if (params) {
          const [location, payload] = params

          console.log('location:', location, '\npayload:', payload)

          const roomId =
            typeof payload === 'string'
              ? parseInt(payload.split('.')[1] || '')
              : null

          if (roomId && !isNaN(roomId)) {
            try {
              get().setCurrentRoom(
                roomId,
                get().rooms?.find(room => room.model.id === roomId)?.model
                  .lastPageNumber,
              )
            } catch {
              console.log(`Room id: ${roomId} is not exist`)
            }

            return
          }

          if (payload == 'add') {
            set(() => ({ isVisibleAddRoomForm: true }))
          }
        }
      },

      inputMode: 'default',
      inputModeContent: null,
      setInputMode: (mode, content) =>
        set(() => ({ inputMode: mode, inputModeContent: content })),

      mode: null,
      setMode: mode => set(() => ({ mode })),

      error: null,
      resetError: () => set(() => ({ error: null })),

      user: null,
      fetchUser: async () => {
        const { fetchMe } = useXenForoApiStore.getState()

        const user = await fetchMe()

        set(() => ({ user }))
      },

      isLoadingMessages: false,
      setLoadingMessages: isLoadingMessages =>
        set(() => ({ isLoadingMessages })),

      isVisibleAddRoomForm: false,
      setVisibleAddRoomForm: isVisible =>
        set(() => ({ isVisibleAddRoomForm: isVisible })),

      visibleSettingsRoomForm: null,
      setVisibleSettingsRoomForm: room =>
        set(() => ({ visibleSettingsRoomForm: room })),

      visibleLeaveRoomDialog: null,
      setVisibleLeaveRoomDialog: room =>
        set(() => ({ visibleLeaveRoomDialog: room })),

      visibleRemoveRoomDialog: null,
      setVisibleRemoveRoomDialog: room =>
        set(() => ({ visibleRemoveRoomDialog: room })),

      sendMessage: async (roomId, text, files) => {
        const {
          sendMessage,
          createMessageAttachmentKey,
          attachFile,
          editMessage,
        } = useXenForoApiStore.getState()

        try {
          let newMessage = await sendMessage(roomId, text)

          const currentRoom = get().currentRoom

          if (files?.length) {
            const { key } = await createMessageAttachmentKey(
              newMessage.model.id,
            )

            await Promise.all(files.map(file => attachFile(key, file)))

            newMessage = await editMessage(
              newMessage.model.id,
              newMessage.model.text,
              key,
            )
          }

          set(() => ({
            rooms: get().rooms?.map(room => {
              if (room.model.id === roomId) {
                const updatedRoom = new Room({
                  ...room.model,
                  lastMessageDate: newMessage.model.createAt,
                  lastMessageId: newMessage.model.id,
                  lastMessage: newMessage,
                })

                if (currentRoom?.model.id === roomId) {
                  set(() => ({ currentRoom: updatedRoom }))
                }

                return updatedRoom
              }

              return room
            }),
          }))

          set(() => ({
            currentRoomMessages: [
              newMessage,
              ...(get().currentRoomMessages || []),
            ],
          }))
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      editMessage: async (messageId, message, files) => {
        const { editMessage, attachFile, createMessageAttachmentKey } =
          useXenForoApiStore.getState()
        try {
          let editedMessage = await editMessage(messageId, message)

          if (files?.length) {
            const { key } = await createMessageAttachmentKey(
              editedMessage.model.id,
            )

            await Promise.all(files.map(file => attachFile(key, file)))

            editedMessage = await editMessage(
              editedMessage.model.id,
              editedMessage.model.text,
              key,
            )
          }

          set(() => ({
            inputMode: 'default',
            inputModeContent: null,
            rooms: get().rooms?.map(room => {
              if (room.model.id === editedMessage.model.roomId) {
                return new Room({
                  ...room.model,
                  lastMessage: editedMessage,
                })
              }

              return room
            }),
            currentRoomMessages: (get().currentRoomMessages || []).map(
              roomMessage => {
                if (roomMessage.model.id === messageId) {
                  return editedMessage
                }

                return roomMessage
              },
            ),
          }))
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      replyMessage: async (roomId, replyMessage, text, files) => {
        try {
          const replyMessageString = generateReplyMessage(replyMessage)

          await get().sendMessage(roomId, replyMessageString + text, files)

          set(() => ({ inputMode: 'default', inputModeContent: null }))
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      loadMoreCurrentRoomMessages: async () => {
        const currentPage = get().currentRoomMessagesPage

        if (currentPage > 1) {
          const currentRoomMessages = get().currentRoomMessages

          const { fetchRoomMessages } = useXenForoApiStore.getState()

          const response = await fetchRoomMessages(
            get().currentRoom!.model.id,
            currentPage - 1,
          )

          set(() => ({
            currentRoomMessagesPage: response.pagination.currentPage,
            lastCurrentRoomMessagesPage: response.pagination.lastPage,
            currentRoomMessages: [
              ...(currentRoomMessages || []),
              ...response.messages.toReversed(),
            ],
          }))
        }
      },

      update: async () => {
        await get().getRooms({ search: get().searchString })

        const currentRoom = get().currentRoom

        if (currentRoom) {
          const { fetchRoomMessages } = useXenForoApiStore.getState()

          const response = await fetchRoomMessages(
            currentRoom.model.id,
            currentRoom.model.lastPageNumber,
          )

          if (
            currentRoom.model.lastMessageId !==
            response.messages.at(-1)?.model.id
          ) {
            set(() => ({
              currentRoomMessages: response.messages.toReversed(),
              currentRoomMessagesPage: response.pagination.currentPage,
              lastCurrentRoomMessagesPage: response.pagination.lastPage,
            }))
          }
        }
      },

      currentRoom: null,
      currentRoomMessages: null,
      currentRoomMessagesPage: 1,
      lastCurrentRoomMessagesPage: null,
      resetCurrentRoom: () => {
        set(() => ({ currentRoom: null }))
      },
      setCurrentRoom: async (roomId, messagesPage = 0) => {
        const currentRoom =
          get().rooms?.find(room => room.model.id === roomId) || null

        const lastPage = currentRoom?.model.lastPageNumber || messagesPage

        get().setLoadingMessages(true)

        set(() => ({
          inputMode: 'default',
          inputModeContent: null,
        }))

        try {
          const user = get().user

          const roomUrl = `?conversations/${user?.username}.${roomId}`

          const { fetchRoomMessages } = useXenForoApiStore.getState()

          const response = await fetchRoomMessages(roomId, lastPage)

          const currentRoomMessages = response.messages.toReversed()

          set(() => ({
            currentRoom,
            currentRoomMessages,
            currentRoomMessagesPage: response.pagination.currentPage,
            lastCurrentRoomMessagesPage: response.pagination.lastPage,
          }))

          if (currentRoom?.model.isUnread) {
            get().setUnreadRoom(roomId, false)
          }

          get().resetError()

          get().setLoadingMessages(false)

          window.history.replaceState({}, document.title, roomUrl)
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))

          get().setLoadingMessages(false)
        }
      },

      addNewRoom: async params => {
        const { addRoom } = useXenForoApiStore.getState()

        try {
          const newRoom = await addRoom(params)

          set(() => ({
            rooms: [...(get().rooms || []), newRoom],
          }))

          get().setCurrentRoom(newRoom.model.id)

          get().resetError()
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      updateRoom: async (roomId, params) => {
        const { updateRoom } = useXenForoApiStore.getState()

        try {
          const updatedRoom = await updateRoom(roomId, params)

          set(() => ({
            rooms: [
              ...(get().rooms || []).map(room => {
                if (room.model.id === roomId) {
                  return updatedRoom
                }

                return room
              }),
            ],
          }))

          const currentRoom = get().currentRoom

          if (currentRoom?.model?.id === roomId) {
            set(() => ({ currentRoom: updatedRoom }))
          }

          get().resetError()
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      inviteRoom: async (roomId, users) => {
        const { inviteRoom } = useXenForoApiStore.getState()

        try {
          const { success } = await inviteRoom(
            roomId,
            users.map(user => user.user_id),
          )

          const currentRoom = get().currentRoom

          if (success && currentRoom?.model.id === roomId) {
            const updatedRoom = new Room({
              ...currentRoom.model,
              members: [
                ...currentRoom.model.members.filter(
                  member =>
                    !users.map(user => user.user_id).includes(member.model.id),
                ),
                ...users.map(user => adoptMember(user)),
              ],
            })

            set(() => ({
              currentRoom: updatedRoom,
            }))
          }
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      leaveRoom: async roomId => {
        const { leaveRoom } = useXenForoApiStore.getState()

        try {
          const { success } = await leaveRoom(roomId, { ignore: true })

          const currentRoom = get().currentRoom

          if (success && currentRoom?.model.id === roomId) {
            set(() => ({ currentRoom: null }))
          }

          if (success) {
            set(() => ({
              rooms: [
                ...(get().rooms || []).filter(room => room.model.id != roomId),
              ],
            }))
          }
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      rooms: null,
      searchString: '',
      getRooms: async params => {
        const search = params?.search ?? ''
        const { fetchRooms } = useXenForoApiStore.getState()

        set(() => ({ searchString: search }))

        try {
          const rooms = await fetchRooms({ search })

          set(() => ({ rooms }))
          get().resetError()
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      setStarRoom: async (roomId, isStared) => {
        console.log(isStared)
        const { starRoom } = useXenForoApiStore.getState()

        try {
          const { success } = await starRoom(roomId)

          const currentRoom = get().currentRoom

          if (success && currentRoom?.model?.id === roomId) {
            currentRoom.model.isStared = isStared

            set(() => ({ currentRoom: new Room(currentRoom.model) }))
          }

          if (success) {
            set(() => ({
              rooms: get().rooms?.map(room => {
                if (room.model.id === roomId) {
                  room.model.isStared = isStared
                }

                return room
              }),
            }))

            get().resetError()
          }
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      setUnreadRoom: async (roomId, isUnread) => {
        const { readRoom, unreadRoom } = useXenForoApiStore.getState()

        try {
          const now = parseInt((new Date().getTime() / 1000).toFixed(0))

          const { success } = isUnread
            ? await unreadRoom(roomId)
            : await readRoom(roomId, now)

          const currentRoom = get().currentRoom

          if (success && currentRoom?.model.id === roomId) {
            currentRoom.model.isUnread = isUnread

            set(() => ({ currentRoom: new Room(currentRoom.model) }))
          }

          if (success) {
            set(() => ({
              rooms: get().rooms?.map(room => {
                if (room.model.id === roomId) {
                  room.model.isUnread = isUnread
                }

                return room
              }),
            }))

            get().resetError()
          }
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },
    }),
    {
      name: 'chat-storage',
    },
  ),
  // ),
)

export default useChatStore
