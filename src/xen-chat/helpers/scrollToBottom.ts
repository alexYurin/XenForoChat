export default function scrollToBottom(list?: HTMLElement | null) {
  if (list) {
    const scrollHeight = list.scrollHeight
    const height = list.clientHeight
    const maxScrollTop = scrollHeight - height

    list.scrollTop = maxScrollTop
  }
}
