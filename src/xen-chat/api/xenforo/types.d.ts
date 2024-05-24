export type ConversationType = {
  username: string
  recipients: Record<string, number | string>
  is_starred: boolean
  is_unread: boolean
  can_edit: boolean
  can_reply: boolean
  can_invite: boolean
  can_upload_attachment: boolean
  view_url: string
  conversation_id: number
  title: string
  user_id: number
  start_date: number
  open_invite: boolean
  conversation_open: boolean
  reply_count: number
  recipient_count: number
  first_message_id: number
  last_message_page: number
  last_message_date: number
  last_message_id: number
  last_message_user_id: number
  last_message: ConversationMessageType
  Starter: UserType
}

export type ConversationMessageType = {
  username: string
  is_unread: boolean
  message_parsed: string
  can_edit: boolean
  can_react: boolean
  view_url: string
  Conversation?: ConversationType
  Attachments?: AttachmentType[]
  is_reacted_to: boolean
  visitor_reaction_id: number
  message_id: number
  conversation_id: number
  message_date: number
  user_id: number
  message: string
  attach_count: number
  reaction_score: number
  User: UserType
}

export type AttachmentType = {
  filename: string
  file_size: number
  height: number
  width: number
  thumbnail_url: string
  direct_url: string
  is_video: boolean
  is_audio: boolean
  attachment_id: number
  content_type: string
  content_id: number
  attach_date: number
  view_count: number
}

export type UserType = {
  about?: string
  activity_visible?: boolean
  age: number
  alert_optout?: unknown[]
  allow_post_profile?: string
  allow_receive_news_feed?: string
  allow_send_personal_conversation?: string
  allow_view_identities?: string
  allow_view_profile?: string
  avatar_urls: Record<string, string> //Maps from size types to URL.
  profile_banner_urls: Record<string, string> //Maps from size types to URL.
  can_ban: boolean
  can_converse: boolean
  can_edit: boolean
  can_follow: boolean
  can_ignore: boolean
  can_post_profile: boolean
  can_view_profile: boolean
  can_view_profile_posts: boolean
  can_warn: boolean
  content_show_signature?: boolean
  creation_watch_state?: string
  custom_fields?: Record<string, string>
  custom_title?: string
  dob?: Record<string, string>
  email?: string
  email_on_conversation?: boolean
  gravatar?: string
  interaction_watch_state?: boolean
  is_admin?: boolean
  is_banned?: boolean
  is_discouraged?: boolean
  is_followed?: boolean
  is_ignored?: boolean
  is_moderator?: boolean
  is_super_admin?: boolean
  last_activity?: number
  location: string
  push_on_conversation?: boolean
  push_optout?: unknown[]
  receive_admin_email?: boolean
  secondary_group_ids?: number[]
  show_dob_date?: boolean
  show_dob_year?: boolean
  signature: string
  timezone?: string
  use_tfa?: boolean
  user_group_id?: number
  user_state?: string
  user_title: string
  visible?: boolean
  warning_points?: number
  website?: string
  view_url: string
  user_id: number
  username: string
  message_count: number
  question_solution_count: number
  register_date: number
  trophy_points: number
  is_staff: boolean
  reaction_score: number
  vote_score: number
}

export type XenForoErrorType = {
  code: string
  message: string
  params: Record<string, string[]>
}

export type ResponseConversationMessageType = {
  message: ConversationMessageType
}

export type ResponseConversationMessagesType = {
  messages: ConversationMessageType[]
}

export type ResponseConversationsType = {
  conversations: ConversationType[]
}

export type ResponseConversationType = {
  conversation: ConversationType
}

export type ResponseSuccessType = {
  success: boolean
}

export type ResponsePaginationType = {
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    shown: number
    total: number
  }
}

export type ResponseErrorType = {
  errors: XenForoErrorType[]
}

export type ResponseAttachmentsType = {
  attachments: AttachmentType[]
}

export type ResponseAttachmentType = {
  attachment: AttachmentType
}

export type ResponseMeType = {
  me: UserType
}

export type ResponseFindUsernameType = {
  exact: UserType | null
  recommendations: UserType[]
}

export type RequestParamsAddConversation = {
  recipient_ids: number[]
  title: string
  message: string
  conversation_open?: string
  open_invite?: string
  attachment_key?: string | number
}

export type RequestParamsUpdateConversation = {
  title?: string
  open_invite?: string
  conversation_open?: string
}

export type RequestParamsSearchConversation = {
  page?: number
  search?: string
  starter_id?: number
  receiver_id?: number
  starred?: string
  unread?: string
}
