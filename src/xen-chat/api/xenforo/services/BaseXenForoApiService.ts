import type { AxiosRequestConfig, AxiosInstance } from 'axios'

export type BaseXenForoApiServiceNetwork = (
  options?: AxiosRequestConfig,
) => AxiosInstance

export default abstract class BaseXenForoApiService {
  static path = ''

  protected network: BaseXenForoApiServiceNetwork

  constructor(network: BaseXenForoApiServiceNetwork) {
    this.network = network
  }
}
