import BaseXenForoApiService, {
  BaseXenForoApiServiceNetwork,
} from './BaseXenForoApiService'
import { toQueryString } from '@app/helpers'
import qs from 'qs'
import type {
  RequestParamsAttachmentKey,
  ResponseAttachmentsType,
  ResponseAttachmentType,
  ResponseSuccessType,
} from '@app/api/xenforo/types'

export class AttachmentsApiService extends BaseXenForoApiService {
  static path = 'attachments'

  constructor(network: BaseXenForoApiServiceNetwork) {
    super(network)

    this.network = network
  }

  public async getAll(params: { key: string }) {
    const queryString = toQueryString(params)

    return this.network().get<ResponseAttachmentsType>(
      `/${AttachmentsApiService.path}?${queryString}`,
    )
  }

  public async upload(params: { key: string; attachment: File }) {
    const form = new FormData()

    form.append('key', params.key)
    form.append('attachment', params.attachment)

    return this.network({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).post<ResponseAttachmentType>(`/${AttachmentsApiService.path}`, form)
  }

  public async newKey(params: RequestParamsAttachmentKey) {
    const form = new FormData()

    form.append('type', params.type)
    form.append(`context[message_id]`, `${params.messageId}`)

    if (params.attachment) {
      form.append('attachment', params.attachment)
    }

    return this.network({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).post<{ key: string } & Partial<ResponseAttachmentType>>(
      `/${AttachmentsApiService.path}/new-key`,
      form,
    )
  }

  public async get(attachment_id: number) {
    return this.network().get<ResponseAttachmentType>(
      `/${AttachmentsApiService.path}/${attachment_id}`,
    )
  }

  public async getBinary(attachment_id: number) {
    return this.network().get<BinaryData>(
      `/${AttachmentsApiService.path}/${attachment_id}/data`,
    )
  }

  public async getThumbnail(attachment_id: number) {
    return this.network().get<{ url: string }>(
      `/${AttachmentsApiService.path}/${attachment_id}/thumbnail`,
    )
  }

  public async delete(attachment_id: number) {
    return this.network().delete<ResponseSuccessType>(
      `/${AttachmentsApiService.path}/${attachment_id}`,
    )
  }
}
