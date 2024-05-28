import { http } from '@app/utils'
import { AxiosRequestConfig } from 'axios'
import {
  ConversationsApiService,
  ConversationMessagesApiService,
  AttachmentsApiService,
  UserApiService,
} from './services'

import type { ResponseErrorType } from '@app/api/xenforo/types'

type XenforoApiOptionsType = {
  baseApiUrl?: string
  token?: string
}

export default class XenforoApi {
  private baseApiUrl?: string
  private token?: string

  public user: UserApiService
  public conversations: ConversationsApiService
  public conversationMessages: ConversationMessagesApiService
  public attachments: AttachmentsApiService

  constructor(options: XenforoApiOptionsType | undefined = undefined) {
    this.baseApiUrl = options?.baseApiUrl
    this.token = options?.token

    this.user = new UserApiService(this.network.bind(this))
    this.attachments = new AttachmentsApiService(this.network.bind(this))
    this.conversations = new ConversationsApiService(this.network.bind(this))
    this.conversationMessages = new ConversationMessagesApiService(
      this.network.bind(this),
    )
  }

  public updateApiUrl(url: string) {
    this.baseApiUrl = url
  }

  public updateToken(token: string) {
    this.token = token
  }

  public network(options?: AxiosRequestConfig) {
    const requestOptions = options || { headers: {} }

    return http<ResponseErrorType>({
      ...requestOptions,
      baseURL: this.baseApiUrl,
      headers: {
        ...(requestOptions.headers || {}),
        'XF-Api-Key': this.token,
      },
    })
  }
}
