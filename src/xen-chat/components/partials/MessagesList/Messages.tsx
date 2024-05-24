import { useChatStore } from '@app/store'
import MessagesListItem from './MessagesListItem'

const Messages = () => {
  const messages = useChatStore(state => state.currentRoomMessages)

  return (
    <>
      {messages?.map(message => (
        <MessagesListItem key={message.model.id} detail={message.model} />
      ))}
    </>
  )
}

export default Messages
