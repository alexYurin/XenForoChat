import { Room, Member, Message, Attachment } from '@app/core/domain'
import { useChatStore } from '@app/store'
import {
  UserType,
  ConversationMessageType,
  AttachmentType,
  ConversationType,
} from '@app/api/xenforo/types'

const parseDate = (unixTime: number) => new Date(unixTime * 1000)

export function adoptAttachment(attachment: AttachmentType) {
  return new Attachment({
    id: attachment.attachment_id,
    name: attachment.filename,
    url: attachment.direct_url,
    thumbnailUrl: attachment.thumbnail_url,
    size: attachment.file_size,
    type: attachment.content_type,
    createdAt: parseDate(attachment.attach_date),
  })
}

export function adoptMember(user: UserType) {
  return new Member({
    id: user.user_id,
    name: user.username,
    title: user.user_title,
    avatar: user.avatar_urls.h,
    link: user.view_url,
  })
}

export function adoptRoom(conversation: ConversationType) {
  const user = useChatStore.getState().user

  return new Room({
    id: conversation.conversation_id,
    title: conversation.title,
    note: conversation.note,
    isOwner: conversation.user_id === user?.user_id,
    isStared: conversation.is_starred,
    isUnread: conversation.is_unread,
    isOpenConversation: conversation.conversation_open,
    isOpenInvite: conversation.open_invite,
    owner: adoptMember(conversation.Starter),
    firstMessageId: conversation.first_message_id,
    lastMessageId: conversation.last_message_id,
    lastPageNumber: conversation.last_message_page,
    lastMessage: adoptMessage(conversation.last_message),
    lastMessageDate: parseDate(conversation.last_message_date),
    createdAt: parseDate(conversation.start_date),
    members: conversation.members.map(
      member =>
        new Member({
          id: member.user_id,
          name: member.username,
          title: member.user_title,
          avatar: member.avatar_urls.h,
          link: member.view_url,
        }),
    ),
    permissions: {
      isCanEdit: conversation.can_edit,
      isCanInvite: conversation.can_invite,
      isCanReply: conversation.can_invite,
      isCanUploadAttachment: conversation.can_upload_attachment,
    },
  })
}

export function adoptMessage(conversationMessage: ConversationMessageType) {
  const user = useChatStore.getState().user

  return new Message({
    id: conversationMessage.message_id,
    text: conversationMessage.message,
    textParsed: conversationMessage.message_parsed,
    isAuthor: user?.user_id === conversationMessage.user_id,
    isUnread: conversationMessage.is_unread,
    roomId: conversationMessage.conversation_id,
    member: adoptMember(conversationMessage.User),
    attachments: (conversationMessage?.Attachments || []).map(attachment =>
      adoptAttachment(attachment),
    ),
    createAt: new Date(conversationMessage.message_date * 1000),
    permissions: {
      isCanEdit: conversationMessage.can_edit,
      isCanReact: conversationMessage.can_react,
    },
  })
}
