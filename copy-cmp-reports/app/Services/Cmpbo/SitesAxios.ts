import Config from '@ioc:Adonis/Core/Config'
import { AxiosRequestConfig } from 'axios'
import Base from './Base'
class Axios extends Base {
  constructor(config: AxiosRequestConfig) {
    super(config)
  }

  public async getData(url, config){
    return this.$api
      .get(`${url}/cmp-bo/api/v1/sites`, config)
      .then(( data ) => {
        const maybeResult = data
        return maybeResult //? maybeResult : []
    })   
  }
}

export default new Axios(Config.get('api.entities'))
