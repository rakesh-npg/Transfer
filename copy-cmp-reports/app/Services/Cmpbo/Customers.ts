import Config from '@ioc:Adonis/Core/Config'
import { AxiosRequestConfig } from 'axios'
import Base from './Base'

class Customers extends Base {
  constructor(config: AxiosRequestConfig) {
    super(config)
  }

  public async getMultiple(): Promise<any[]> {
    return this.$api.get(`/v1/customers`).then(({ data }) => {
      const maybeResult = data['data']
      return maybeResult ? maybeResult : []
    })
  }
}

export default new Customers(Config.get('api.entities'))
