import { ReactNode } from 'react'

export type LayoutProps = {
  root: HTMLElement
  closeApp: () => void
  inputComponent: ReactNode
}
