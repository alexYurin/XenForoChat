import { MessageModelType } from '@app/core/domain/Message'

export default function generateReplyMessage(messageModel: MessageModelType) {
  const userModel = messageModel.member.model

  const member = `member: ${userModel.id}`

  return `[QUOTE="
      ${userModel.name}, convMessage: ${messageModel.id}${member}
      "]\n${messageModel.text}\n[/QUOTE]\n`
}
