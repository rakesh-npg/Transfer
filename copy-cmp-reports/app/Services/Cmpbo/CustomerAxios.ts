import Config from '@ioc:Adonis/Core/Config'
import { AxiosRequestConfig } from 'axios'
import Base from './Base'
class Axios extends Base {
  constructor(config: AxiosRequestConfig) {
    super(config)
  }

  public async getData(baseUrl, config){
    return this.$api
      .get(`${baseUrl}/cmp-bo/api/v1/customers`, config)
      .then(( data ) => {
        const maybeResult = data
        return maybeResult //? maybeResult : []
    })
  }
}

export default new Axios(Config.get('api.entities'))
