import FormData from 'form-data'
import Mailgun from 'mailgun.js'
import Config from '@ioc:Adonis/Core/Config'
import Options from 'mailgun.js/interfaces/Options'
import client from 'mailgun.js/client'
import Env from '@ioc:Adonis/Core/Env'
import { MailgunMessageData } from 'mailgun.js/interfaces/Messages'

class MailgunService extends Mailgun {
  protected mailClient: client
  protected domain: string
  constructor(config: Options) {
    super(FormData)
    this.mailClient = this.client(config)
    this.domain = Env.get('MAILGUN_DOMAIN')
  }

  public async sendMail(messageData: MailgunMessageData) {
    return this.mailClient.messages.create(this.domain, messageData)
  }
}

export default new MailgunService(Config.get('mailgun.mailgunConfig'))
