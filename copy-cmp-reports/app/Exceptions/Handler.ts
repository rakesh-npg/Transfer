/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.isNGPException) {
      ctx.response.status(error.status)
      if (error.status === 204) return ctx.response.noContent()
      return { status: error.status, message: error.code }
    }

    switch (error.code) {
      case 'E_VALIDATION_FAILURE':
        return { ...error.messages }
      case 'E_REQUEST_ENTITY_TOO_LARGE':
      case 'E_ROUTE_NOT_FOUND':
        return { status: error.status, message: error.code }
      default:
        return await super.handle({ status: 500, message: 'error' }, ctx)
    }
  }

  public report(error: any, ctx: HttpContextContract) {
    const msg = (error.isNGPException ? error.log : error.message) || ''
    ctx.logger.error(
      `${ctx.request.url()},request=${JSON.stringify(ctx.request.all())},response=${JSON.stringify(
        error
      )}${msg ? ',message=' : ''}${msg}`
    )
  }
}
