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

const excludeErrors = ['Request aborted']

const urlSeparator = '.'

const createError = (error: unknown): ErrorType | null => {
  if (Array.isArray((error as ResponseErrorType).errors)) {
    return {
      message: (error as ResponseErrorType).errors
        .map(er => er.message)
        .join(','),
    }
  }

  console.log(error)

  return excludeErrors.filter(err => `${error}`.includes(err)).length === 0
    ? { message: `${error}` }
    : null
}

// @TODO Decompose
// @TODO create selectors

export interface ChatState {
  isReady: boolean
  isMinimize: boolean
  setMinimize: (isMinimize: boolean) => void
  rootHeight: number | null
  setRootHeight: (height: number) => void
  setReady: (isReady: boolean) => void
  handleApiUrl: (location: Location) => void
  isUrlQuery: boolean
  inviteUser: UserType | null
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
  loadingRoom: number | null
  setLoadingRoom: (roomId: number | null) => void
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
  searchFilter: { unread: '1' | '0' }
  rooms: Room[] | null
  getRooms: (params?: Partial<RequestParamsSearchConversation>) => Promise<void>
  loadMoreRooms: () => Promise<void>
  currentRoom: Room | null
  roomsPage: number
  lastRoomsPage: number | null
  resetCurrentRoom: () => void
  securityRoomProps: {
    title: string
    enabled: boolean
    keyReceived: boolean | null
    generateKey?: string
  } | null
  setSecurityKey: {
    resolve: ((value: string | undefined) => void) | null
  }
  securityKeys?: { roomId: number; key: string }[]
  waitSecurityKey: () => Promise<string | undefined>
  setCurrentRoom: (roomId: number, isUpdate?: boolean) => Promise<void>
  addNewRoom: (params: RequestParamsAddConversation) => Promise<void>
  updateRoom: (
    roomId: number,
    params: RequestParamsUpdateConversation,
  ) => Promise<void>
  inviteRoom: (roomId: number, users: UserType[]) => Promise<void>
  noteRoom: (roomId: number, text: string) => Promise<void>
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
      isMinimize: true,
      setMinimize: isMinimize => set(() => ({ isMinimize })),

      rootHeight: null,
      setRootHeight: height => set(() => ({ rootHeight: height })),

      isReady: false,
      setReady: isReady => {
        set(() => ({ isReady }))
      },

      isUrlQuery: false,
      inviteUser: null,
      handleApiUrl: async location => {
        const isMinimize = get().isMinimize
        const mode = get().mode

        if (mode === XenChatMode.POPUP && isMinimize) {
          return
        }

        const params = location.search.replace('?', '')?.split('/')
        const pathname = location.pathname

        const pathnameLocations = pathname.split('/')

        const showAddRoom = () => set(() => ({ isVisibleAddRoomForm: true }))

        const setRoom = (roomId: number) => {
          try {
            get().setCurrentRoom(roomId)
          } catch {
            console.log(`Room id: ${roomId} is not exist`)
          }
        }

        const invite = async (username: string | null) => {
          if (username) {
            const { findUser } = useXenForoApiStore.getState()
            const { exact } = await findUser(username)

            set(() => ({ inviteUser: exact }))
          }
        }

        const inviteUser = new URL(location.toString()).searchParams.get('to')

        if (pathnameLocations.includes('add')) {
          await invite(inviteUser)
          showAddRoom()
        } else {
          pathnameLocations.forEach(path => {
            const roomId = parseInt(path.split(urlSeparator)[1] || '')

            if (roomId && !isNaN(roomId)) {
              setRoom(roomId)

              return
            }
          })
        }

        if (params) {
          const [location, payload] = params

          console.log('location:', location, '\npayload:', payload)

          const roomId =
            typeof payload === 'string'
              ? parseInt(payload.split(urlSeparator)[1] || '')
              : null

          if (roomId && !isNaN(roomId)) {
            set(() => ({ isUrlQuery: true }))
            setRoom(roomId)

            return
          }

          const convertedPayload =
            payload?.replace('&', '|')?.replace('?', '|')?.split('|') || []

          convertedPayload.forEach(async res => {
            if (res === 'add') {
              set(() => ({ isUrlQuery: true }))
              await invite(inviteUser)
              showAddRoom()
            }
          })
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

      loadingRoom: null,
      setLoadingRoom: roomId => set(() => ({ loadingRoom: roomId })),

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
        const currentRoom = get().currentRoom
        const currentPage = get().roomsPage

        // @TODO handle current page

        await get()
          .getRooms({
            search: get().searchString,
            unread: get().searchFilter.unread,
            page: 1 /*currentPage*/,
          })
          .then(() => {
            if (currentRoom) {
              get().setCurrentRoom(currentRoom.model.id, true)
            }
          })
      },

      currentRoom: null,
      currentRoomMessages: null,
      currentRoomMessagesPage: 1,
      lastCurrentRoomMessagesPage: null,
      resetCurrentRoom: () => {
        set(() => ({ currentRoom: null }))
      },
      securityRoomProps: null,
      setSecurityKey: { resolve: null },
      waitSecurityKey: () =>
        new Promise(resolve => {
          return set(() => ({ setSecurityKey: { resolve } }))
        }),
      setCurrentRoom: async (roomId, isUpdate) => {
        const { getRoom } = useXenForoApiStore.getState()
        const prevRoomId = get().currentRoom?.model?.id

        let isOutRangeRoom = false

        let currentRoom =
          get().rooms?.find(room => room.model.id === roomId) || null

        if (!currentRoom) {
          const extraResponse = await getRoom(roomId)

          isOutRangeRoom = true

          currentRoom = extraResponse.room
        }

        const lastPage = currentRoom?.model.lastPageNumber || 1

        if (!isUpdate) {
          get().setLoadingRoom(roomId)

          set(() => ({
            inputMode: 'default',
            inputModeContent: null,
          }))
        }

        const isShowSecurity = currentRoom.model.security.enabled
        const isReceivedSecurityKey = currentRoom.model.security.keyReceived

        let enterSecurityKey: string | undefined
        let generatedRoomKey: string | undefined

        const securityPair = get().securityKeys?.find(
          pair => pair.roomId === roomId,
        )

        if (isShowSecurity && !isReceivedSecurityKey) {
          const { generateSecureRoomKey } = useXenForoApiStore.getState()

          generatedRoomKey = await generateSecureRoomKey(roomId)
        }

        if (isShowSecurity && !securityPair?.key && !isUpdate) {
          set(() => ({
            securityRoomProps: {
              ...currentRoom.model.security,
              title: currentRoom.model.title,
              generateKey: generatedRoomKey,
            },
          }))

          enterSecurityKey = await get().waitSecurityKey()

          await set(() => ({
            securityKeys: [
              ...(get().securityKeys || []),
              { roomId, key: enterSecurityKey as string },
            ],
            setSecurityKey: { resolve: null },
            securityRoomProps: null,
          }))

          if (!isUpdate) {
            get().setLoadingRoom(null)
          }

          if (!enterSecurityKey) {
            return
          }
        }

        // 4Y_iC1BeeORWGQe6RZvgZPdQq0Rmichp test-protected (testa)

        // n_tMsN3FXZlEUIRtZb7iqLGHKJmHGdaq Prot (testb)
        // n_tMsN3FXZlEUIRtZb7iqLGHKJmHGdaq Prot (testa)
        // n_tMsN3FXZlEUIRtZb7iqLGHKJmHGdaq Prot (testc)

        // ngmMuqqG7AyY427PkvYoCGQ37Y4MNjZl test protected (testa)
        // ngmMuqqG7AyY427PkvYoCGQ37Y4MNjZl Test protected (testc)

        try {
          const user = get().user
          const securityKey = get().securityKeys?.find(
            pair => pair.roomId === roomId,
          )?.key

          const { fetchRoomMessages } = useXenForoApiStore.getState()

          const response = await fetchRoomMessages(
            roomId,
            lastPage,
            securityKey,
          )

          const prevRoomMessages = get().currentRoomMessages
          const currentRoomMessages = response.messages.toReversed()

          if (isOutRangeRoom) {
            set(() => ({ rooms: [currentRoom, ...(get().rooms || [])] }))

            isOutRangeRoom = false
          }

          let updateStore: Partial<ChatState> = {}

          if (isUpdate) {
            const updatedRoom = get().rooms?.find(
              room => room.model.id === roomId,
            )

            updateStore = {
              ...(updatedRoom?.model.lastMessageId !==
              prevRoomMessages?.at(0)?.model.id
                ? {
                    currentRoomMessages,
                    currentRoomMessagesPage: response.pagination.currentPage,
                    lastCurrentRoomMessagesPage: response.pagination.lastPage,
                  }
                : {}),
            }
          } else {
            updateStore = {
              ...(roomId !== prevRoomId
                ? {
                    currentRoom: isShowSecurity
                      ? new Room({
                          ...currentRoom.model,
                          security: {
                            enabled: true,
                            keyReceived: Boolean(securityKey),
                          },
                        })
                      : currentRoom,
                  }
                : {}),
              currentRoomMessages,
              currentRoomMessagesPage: response.pagination.currentPage,
              lastCurrentRoomMessagesPage: response.pagination.lastPage,
            }
          }

          set(() => updateStore)

          if (currentRoom?.model.isUnread) {
            get().setUnreadRoom(roomId, false)
          }

          get().resetError()

          get().setLoadingRoom(null)

          if (get().isUrlQuery) {
            const roomUrl = `?conversations/${currentRoom.model.title
              .toLowerCase()
              .replaceAll(' ', '-')
              .replaceAll('%20', '-')}}${urlSeparator}${roomId}`

            window.history.replaceState({}, document.title, roomUrl)
          } else {
            const pathname = window.location.pathname
              .replace('/add', '')
              .replace('/unread', '')
              .replace('index.html', '')
              .replace('index.php', '')
              .replace(
                `${user?.username}${urlSeparator}${prevRoomId ?? roomId}`,
                '',
              )

            let roomUrl = `${pathname}`.replace(
              `${urlSeparator}${prevRoomId || roomId}`,
              `${urlSeparator}${roomId}`,
            )

            if (prevRoomId || pathname === roomUrl) {
              roomUrl = `/conversations/${currentRoom.model.title
                .toLowerCase()
                .replaceAll(' ', '-')
                .replaceAll('%20', '-')}${urlSeparator}${roomId}`
            }

            window.history.replaceState({}, document.title, roomUrl)
          }
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({
            securityKeys: get().securityKeys?.filter(
              pair => pair.roomId !== roomId,
            ),
            error: createError(responseError),
          }))

          get().setLoadingRoom(null)
        }
      },

      addNewRoom: async params => {
        const { addRoom } = useXenForoApiStore.getState()

        try {
          const newRoom = await addRoom(params)

          if (params.note) {
            await get().noteRoom(newRoom.model.id, params.note)
          }

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

      noteRoom: async (roomId, text) => {
        const { noteRoom } = useXenForoApiStore.getState()

        try {
          const updatedRoom = await noteRoom(roomId, text)

          if (get().currentRoom) {
            set(() => ({ currentRoom: updatedRoom }))
          }

          set(() => ({
            rooms: (get().rooms || []).map(room => {
              if (room.model.id === roomId) {
                return updatedRoom
              }

              return room
            }),
          }))
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
      roomsPage: 1,
      lastRoomsPage: null,
      searchString: '',
      searchFilter: {
        unread: '0',
      },
      loadMoreRooms: async () => {
        const roomsPage = get().roomsPage
        const lastRoomsPage = get().lastRoomsPage
        const unread = get().searchFilter.unread

        if (roomsPage < (lastRoomsPage || 1)) {
          const { fetchRooms } = useXenForoApiStore.getState()
          const rooms = get().rooms

          try {
            const response = await fetchRooms({
              page: roomsPage + 1,
              unread,
            })

            set(() => ({
              roomsPage: response.pagination.currentPage,
              lastRoomsPage: response.pagination.lastPage,
              rooms: [...(rooms || []), ...response.rooms],
            }))
            get().resetError()
          } catch (error) {
            const responseError = error as ResponseErrorType
            set(() => ({ error: createError(responseError) }))
          }
        }
      },

      getRooms: async params => {
        const search = params?.search ?? ''
        const unread = params?.unread ?? '0'

        const { fetchRooms } = useXenForoApiStore.getState()

        set(() => ({ searchString: search, searchFilter: { unread } }))

        try {
          const response = await fetchRooms({
            search,
            unread,
            page: search || unread === '1' ? 1 : params?.page ?? 1,
          })

          set(() => ({
            rooms: response.rooms,
            roomsPage: response.pagination.currentPage,
            lastRoomsPage: response.pagination.lastPage,
          }))
          get().resetError()
        } catch (error) {
          const responseError = error as ResponseErrorType
          set(() => ({ error: createError(responseError) }))
        }
      },

      setStarRoom: async (roomId, isStared) => {
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
