import Config from '@ioc:Adonis/Core/Config'
import { AxiosRequestConfig } from 'axios'
import Base from './Base'

class Eniscope extends Base {
  constructor(config: AxiosRequestConfig) {
    super(config)
  }

  public async getMultiple(circuitIds, currentDate, past14Day): Promise<any[]> {
    return this.$api
      .get(`/v1/eniscope/getMultiple`, {
        params: { circuitIds, startDate: past14Day, endDate: currentDate },
      })
      .then(({ data }) => {
        const maybeResult = data['data']
        return maybeResult ? maybeResult : []
      })
  }
}

export default new Eniscope(Config.get('api.entities'))
