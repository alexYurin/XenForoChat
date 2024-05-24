import { http } from '@app/utils'
import { AxiosRequestConfig } from 'axios'
import {
  ConversationsApiService,
  ConversationMessagesApiService,
  AttachmentsApiService,
  UserApiService,
} from './services'

import type { ResponseErrorType } from '@app/api/xenforo/types'

const BASE_URL = 'https://xnf-demo.updemo.site/api/'

type XenforoApiOptionsType = {
  token?: string
}

export default class XenforoApi {
  private token?: string

  public user: UserApiService
  public conversations: ConversationsApiService
  public conversationMessages: ConversationMessagesApiService
  public attachments: AttachmentsApiService

  constructor(options: XenforoApiOptionsType | undefined = undefined) {
    this.token = options?.token

    this.user = new UserApiService(this.network.bind(this))
    this.attachments = new AttachmentsApiService(this.network.bind(this))
    this.conversations = new ConversationsApiService(this.network.bind(this))
    this.conversationMessages = new ConversationMessagesApiService(
      this.network.bind(this),
    )
  }

  public updateToken(token: string) {
    this.token = token
  }

  public network(options?: AxiosRequestConfig) {
    const requestOptions = options || { headers: {} }

    return http<ResponseErrorType>({
      ...requestOptions,
      baseURL: BASE_URL,
      headers: {
        ...(requestOptions.headers || {}),
        'XF-Api-Key': this.token,
      },
    })
  }
}
