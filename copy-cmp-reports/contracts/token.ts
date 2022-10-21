declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    token: {
      uid: string
      claims: {
        name: string
        email: string
        roles: string[]
      }
      aud: string
      iss: string
      sub: string
      iat: number
      exp: number
    }
  }
}
