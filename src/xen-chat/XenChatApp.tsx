import { useEffect } from 'react'
import {
  AppMessage,
  AddRoomForm,
  MessageInput,
  SettingsRoomForm,
  LeaveRoomDialog,
  RemoveRoomDialog,
  SecurityRoomForm,
} from './components/partials'
import { useChatStore } from './store'
import { getLayoutComponent } from './helpers'
import { XenChatMode } from './enums'

import './themes/fonts'
import './themes/index.scss'

export type XenChatAppProps = {
  mode: XenChatMode
  root: HTMLElement
  closeApp: () => void
}

const INTERVAL = 30000 // ms
const DELTA_PADDING = 0 // px

export default function XenChatApp({ root, mode, closeApp }: XenChatAppProps) {
  const setRootHeight = useChatStore(state => state.setRootHeight)
  const setMode = useChatStore(state => state.setMode)
  const fetchUser = useChatStore(state => state.fetchUser)
  const getRooms = useChatStore(state => state.getRooms)
  const setReady = useChatStore(state => state.setReady)
  const update = useChatStore(state => state.update)
  const handleApiUrl = useChatStore(state => state.handleApiUrl)

  let subscribeId: NodeJS.Timeout
  let timeoutId: NodeJS.Timeout

  const Layout = getLayoutComponent(mode)

  const ready = () => {
    checkUrlParams()
    timeoutId = setTimeout(subscribe, INTERVAL)
  }

  const checkUrlParams = () => {
    setTimeout(() => {
      handleApiUrl(window.location)
      setReady(true)
    }, 500)
  }

  const subscribe = () => {
    subscribeId = setInterval(update, INTERVAL)
  }

  const unsubscribe = () => {
    clearInterval(subscribeId)
    clearTimeout(timeoutId)
  }

  const onResize = () => {
    setRootHeight(root.offsetHeight - DELTA_PADDING)
  }

  const init = async () => {
    setMode(mode)
    Promise.all([fetchUser(), getRooms()]).then(ready)
  }

  useEffect(() => {
    init()

    setRootHeight(root.offsetHeight - DELTA_PADDING)

    return unsubscribe
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <Layout
        root={root}
        closeApp={closeApp}
        inputComponent={<MessageInput />}
      />
      <AddRoomForm />
      <SettingsRoomForm />
      <SecurityRoomForm />
      <LeaveRoomDialog />
      <RemoveRoomDialog />
      <AppMessage />
    </>
  )
}
