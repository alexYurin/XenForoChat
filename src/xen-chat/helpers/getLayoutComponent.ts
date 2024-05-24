import { BasicLayout, PopupLayout } from '@app/components/layouts'
import { XenChatMode } from '@app/enums'

export default function getLayoutComponent(mode: XenChatMode) {
  switch (mode) {
    case XenChatMode.POPUP:
      return PopupLayout

    default:
      return BasicLayout
  }
}
