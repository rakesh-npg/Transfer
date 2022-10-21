import Log from 'App/Models/Log'
import { DateTime } from 'luxon'

type GetMultipleOptions = {
  action: string
  from: DateTime
  to: DateTime
}

export default new (class LogRepo {
  public get = (id: string) =>
    Log.query()
      .where('id', id)
      .first()
      .then((log) => log?.serialize())

  public getMultiple = (
    page: number = 1,
    limit: number = 40,
    { action, from, to }: Partial<GetMultipleOptions>
  ) =>
    Log.query()
      .if(action, (builder) => builder.where('action', action!))
      .if(from && to, (builder) =>
        builder.whereBetween('created_at', [
          from!.toISO({ includeOffset: false }),
          to!.toISO({ includeOffset: false }),
        ])
      )
      .paginate(page, limit)
      .then((logs) => {
        const paginated = logs.serialize()
        return { meta: paginated.meta, logs: paginated.data }
      })

  public insert = (payload: any) => Log.create(payload)
})()
