import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

export default class Base {
  protected $api: AxiosInstance
  protected $token: string

  constructor(config: AxiosRequestConfig) {
    this.$api = axios.create(config)
    this.$api.interceptors.response.use(
      (config) => config,
      (err: AxiosError) => {
        if (err.response?.data) {
          console.log(
            JSON.stringify({
              severity: 'ERROR',
              message: err.message,
              data: err.response.data,
              config: err.config,
            })
          )
        }
        return Promise.reject(err)
      }
    )
  }
}
