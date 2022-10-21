import Env from '@ioc:Adonis/Core/Env'
import { AxiosRequestConfig } from 'axios'

export const entities: AxiosRequestConfig = {
  baseURL: Env.get('CMP_BO_URL'),
  headers: {
    Authorization: ``,
  },
}
