import Env from '@ioc:Adonis/Core/Env'
import Options from 'mailgun.js/interfaces/Options'

export const mailgunConfig: Options = {
  username: 'api',
  key: Env.get('MAILGUN_API_KEY'),
  url: Env.get('MAILGUN_HOST'),
}
