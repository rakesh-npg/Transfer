import Config from '@ioc:Adonis/Core/Config'
import { AxiosRequestConfig } from 'axios'
import Base from './Base'
class Circuits extends Base {
  constructor(config: AxiosRequestConfig) {
    super(config)
  }

  public async getMultiple(): Promise<any[]> {
    return this.$api
      .get(`/v1/circuits`, {
        params: {
          with: ['customer', 'site', 'meter'],
        },
      })
      .then(({ data }) => {
        const maybeResult = data['data']
        return maybeResult ? maybeResult : []
      })
  }
}

export default new Circuits(Config.get('api.entities'))
