import { useEffect } from 'react'
import {
  AppMessage,
  AddRoomForm,
  SettingsRoomForm,
  LeaveRoomDialog,
  RemoveRoomDialog,
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

const INTERVAL = 5000 // ms

export default function XenChatApp({ root, mode, closeApp }: XenChatAppProps) {
  const setMode = useChatStore(state => state.setMode)
  const fetchUser = useChatStore(state => state.fetchUser)
  const setReady = useChatStore(state => state.setReady)
  const update = useChatStore(state => state.update)
  const handleApiUrl = useChatStore(state => state.handleApiUrl)

  let subscribeId: NodeJS.Timeout
  let timeoutId: NodeJS.Timeout

  const Layout = getLayoutComponent(mode)

  const ready = () => {
    setReady(true)
    checkUrlParams()
    timeoutId = setTimeout(subscribe, INTERVAL)
  }

  const checkUrlParams = () => {
    handleApiUrl(window.location)
  }

  const subscribe = () => {
    subscribeId = setInterval(update, INTERVAL)
  }

  const unsubscribe = () => {
    clearInterval(subscribeId)
    clearTimeout(timeoutId)
  }

  const init = async () => {
    setMode(mode)
    Promise.all([fetchUser()]).then(ready)
  }

  useEffect(() => {
    init()

    return unsubscribe
  }, [])

  return (
    <>
      <Layout root={root} closeApp={closeApp} />
      <AddRoomForm />
      <SettingsRoomForm />
      <LeaveRoomDialog />
      <RemoveRoomDialog />
      <AppMessage />
    </>
  )
}
