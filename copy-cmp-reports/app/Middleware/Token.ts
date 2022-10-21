import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserToken from 'App/Domain/Token'
import Config from '@ioc:Adonis/Core/Config'
export default class Token {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const encodedToken = request.header('X-Apigateway-Api-Userinfo')

    const rawToken = request.header('x-forwarded-authorization')
      ? request.header('x-forwarded-authorization')
      : request.header('authorization')

    Config.set('api.entities.headers.Authorization', rawToken)

    if (!encodedToken) return response.forbidden({ message: 'No authentication token provided.' })

    try {
      const maybeTokenPayload = JSON.parse(Buffer.from(encodedToken, 'base64').toString('utf-8'))
      const token = UserToken.fromJSON(maybeTokenPayload).asJSONv1
      if (request.ctx) request.ctx.token = token
    } catch (message) {
      console.log(message)
      return response.unauthorized({ message: 'Token is not valid.' })
    }

    await next()
  }
}
