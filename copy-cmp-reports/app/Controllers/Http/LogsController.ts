import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionTypes from 'App/Exceptions/ExceptionTypes'
import { LogRepo } from 'App/Repositories'
import * as Validators from 'App/Validators'
import * as Domains from 'App/Domain'

export default class LogsController {
  public async get({ request }: HttpContextContract) {
    const { id } = await request.validate(Validators.Logs.Get)

    const maybeLog = await LogRepo.get(id)
    if (!maybeLog) throw ExceptionTypes.notFound('No log match that ID.')

    const log = Domains.Log.fromJSON(maybeLog).asJSONv1

    return log
  }

  public async getMultiple({ request }: HttpContextContract) {
    const { page, limit, action, from, to } = await request.validate(Validators.Logs.GetMultiple)

    const maybeLogs = await LogRepo.getMultiple(page, limit, { action, from, to })
    if (!maybeLogs.logs.length) throw ExceptionTypes.noContent()

    const logs = maybeLogs.logs.map((log) => Domains.Log.fromJSON(log).asJSONv1)

    return { meta: maybeLogs.meta, logs }
  }
}
