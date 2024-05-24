import BaseXenForoApiService, {
  BaseXenForoApiServiceNetwork,
} from './BaseXenForoApiService'

import type {
  ResponseMeType,
  ResponseFindUsernameType,
} from '@app/api/xenforo/types'

export class UserApiService extends BaseXenForoApiService {
  static path = 'user'

  constructor(network: BaseXenForoApiServiceNetwork) {
    super(network)

    this.network = network
  }

  public async me() {
    return this.network().get<ResponseMeType>('/me')
  }

  public async find(username: string) {
    return this.network().get<ResponseFindUsernameType>(
      `/users/find-name?username=${username}`,
    )
  }
}
