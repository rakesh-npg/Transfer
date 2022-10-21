import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminOnly {
  public async handle({ response, token }: HttpContextContract, next: () => Promise<void>) {
    // Restrict only to super admin users.
    const isAuthorized = token.claims.roles.find((role) => role === 'SUPER_ADMIN')
    if (!isAuthorized)
      return response.unauthorized({ message: 'User is not allowed to perform this action.' })

    await next()
  }
}
