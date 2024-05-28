import BaseXenForoApiService, {
  BaseXenForoApiServiceNetwork,
} from './BaseXenForoApiService'
import { toQueryString } from '@app/helpers'
import qs from 'qs'

import type {
  ResponseConversationsType,
  ResponseConversationType,
  ResponseConversationMessageType,
  ResponseConversationMessagesType,
  ResponseSuccessType,
  ResponsePaginationType,
  RequestParamsAddConversation,
  RequestParamsSearchConversation,
} from '@app/api/xenforo/types'

export class ConversationsApiService extends BaseXenForoApiService {
  static path = 'conversations'

  constructor(network: BaseXenForoApiServiceNetwork) {
    super(network)

    this.network = network
  }

  public async getAll(params?: Partial<RequestParamsSearchConversation>) {
    const queryString = toQueryString(params || {})

    return this.network().get<
      ResponseConversationsType & ResponsePaginationType
    >(`/${ConversationsApiService.path}?${queryString}`)
  }

  public async create(params: RequestParamsAddConversation) {
    const requestParams = qs.stringify(params)

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).post<ResponseConversationType & ResponseSuccessType>(
      `/${ConversationsApiService.path}`,
      requestParams,
    )
  }

  public async get(conversation_id: number) {
    const queryString = toQueryString({
      with_messages: true,
      page: true,
    })

    return this.network().get<
      ResponseConversationType &
        ResponseConversationMessagesType &
        ResponsePaginationType
    >(`/${ConversationsApiService.path}/${conversation_id}?${queryString}`)
  }

  public async update(
    conversation_id: number,
    params?: Partial<{
      title?: string
      open_invite?: string
      conversation_open?: string
    }>,
  ) {
    const requestParams = qs.stringify(params)

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).post<ResponseConversationType & ResponseSuccessType>(
      `/${ConversationsApiService.path}/${conversation_id}`,
      requestParams,
    )
  }

  public async delete(
    conversation_id: number,
    params?: Partial<{
      ignore: boolean
    }>,
  ) {
    const requestParams = qs.stringify(params)

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).delete<ResponseSuccessType>(
      `/${ConversationsApiService.path}/${conversation_id}`,
      { data: requestParams },
    )
  }

  public async invite(
    conversation_id: number,
    params: {
      recipient_ids: number[]
    },
  ) {
    const requestParams = qs.stringify(params)

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).post<ResponseSuccessType>(
      `/${ConversationsApiService.path}/${conversation_id}/invite`,
      requestParams,
    )
  }

  public async note(
    conversation_id: number,
    params: {
      note: string
    },
  ) {
    const requestParams = qs.stringify(params)

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).post<ResponseConversationType & ResponseSuccessType>(
      `/${ConversationsApiService.path}/${conversation_id}/note`,
      requestParams,
    )
  }

  public async markRead(
    conversation_id: number,
    params?: Partial<{
      date: number | string
    }>,
  ) {
    return this.network().post<ResponseSuccessType>(
      `/${ConversationsApiService.path}/${conversation_id}/mark-read`,
      params,
    )
  }

  public async markUnread(conversation_id: number) {
    return this.network().post<ResponseSuccessType>(
      `/${ConversationsApiService.path}/${conversation_id}/mark-unread`,
    )
  }

  public async getMessages(
    conversation_id: number,
    params?: Partial<{
      page: number
    }>,
  ) {
    const queryString = toQueryString(params || {})

    return this.network().get<
      ResponseConversationMessagesType & ResponsePaginationType
    >(
      `/${ConversationsApiService.path}/${conversation_id}/messages?${queryString}`,
    )
  }

  public async star(
    conversation_id: number,
    params?: Partial<{
      star: boolean
    }>,
  ) {
    const requestParams = qs.stringify(params)

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).post<ResponseSuccessType>(
      `/${ConversationsApiService.path}/${conversation_id}/star`,
      requestParams,
    )
  }
}

export class ConversationMessagesApiService extends BaseXenForoApiService {
  static path = 'conversation-messages'

  constructor(network: BaseXenForoApiServiceNetwork) {
    super(network)

    this.network = network
  }

  public async reply(
    conversation_id: number,
    message: string,
    attachment_key?: string | number,
  ) {
    const requestParams = qs.stringify({
      conversation_id,
      message,
      attachment_key,
    })

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).post<ResponseConversationMessageType & ResponseSuccessType>(
      `/${ConversationMessagesApiService.path}`,
      requestParams,
    )
  }

  public async get(message_id: number) {
    return this.network().get<ResponseConversationMessageType>(
      `/${ConversationMessagesApiService.path}/${message_id}`,
    )
  }

  public async send(params?: {
    conversation_id: number
    message: string
    attachment_key?: string
  }) {
    const requestParams = qs.stringify(params)

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).post<ResponseConversationMessageType & ResponseSuccessType>(
      `/${ConversationMessagesApiService.path}`,
      requestParams,
    )
  }

  public async update(
    message_id: number,
    params?: Partial<{
      message: string
      attachment_key?: string
    }>,
  ) {
    const requestParams = qs.stringify(params)

    return this.network({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).post<ResponseConversationMessageType & ResponseSuccessType>(
      `/${ConversationMessagesApiService.path}/${message_id}`,
      requestParams,
    )
  }

  public async react(message_id: number, params: { reaction_id: number }) {
    return this.network().post<{ action: string } & ResponseSuccessType>(
      `/${ConversationMessagesApiService.path}/${message_id}`,
      params,
    )
  }
}
