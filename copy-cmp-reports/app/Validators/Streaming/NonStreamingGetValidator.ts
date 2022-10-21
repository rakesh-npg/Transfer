import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NonStreamingGetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    circuitIds: schema.array.optional().members(schema.number([rules.unsigned()])),
    meterIds: schema.array.optional().members(schema.number([rules.unsigned()])),
    siteIds: schema.array.optional().members(schema.number([rules.unsigned()])),
    customerIds: schema.array.optional().members(schema.number([rules.unsigned()])),
  })

  public messages = {}
}
