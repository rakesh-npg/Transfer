import { WebClient } from '@slack/web-api'
import Env from '@ioc:Adonis/Core/Env'

class Slack extends WebClient {
  constructor(config: string) {
    super(config)
  }
}

export default new Slack(Env.get('SLACK_BOT_TOKEN'))
