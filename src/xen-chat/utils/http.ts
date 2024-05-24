import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

export interface HTTPOptions extends AxiosRequestConfig {
  statusIgnore?: number[]
}

export const baseURL = '/'

const getStatus = (error: AxiosError): number => error.response?.status || 0

const getBackendErrorMessage = <TError>(error: AxiosError<TError>): TError =>
  error.response?.data as TError

const http = <TError>(options: HTTPOptions = { statusIgnore: [] }) => {
  const { statusIgnore } = options

  const defaultOptions = {
    baseURL,
  }

  const instance = axios.create({
    ...defaultOptions,
    ...options,
  })

  const requestHandler = (request: AxiosRequestConfig) => {
    return request
  }

  const responseHandler = (response: AxiosResponse) => {
    return response
  }

  const errorHandler = (errorResponse: AxiosError<TError>) => {
    const status = getStatus(errorResponse)
    const backendErrorMessage = getBackendErrorMessage<TError>(errorResponse)
    const error = backendErrorMessage || errorResponse.message

    if (statusIgnore?.includes(status)) {
      return
    }

    console.error(`${status}: ${error}`)

    return Promise.reject(error)
  }

  instance.interceptors.request.use(
    requestHandler as (
      value: InternalAxiosRequestConfig<any>,
    ) => InternalAxiosRequestConfig<any>,
    errorHandler,
  )
  instance.interceptors.response.use(responseHandler, errorHandler)

  return instance
}

export default http
