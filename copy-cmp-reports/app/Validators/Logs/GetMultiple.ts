import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ACTION_OPTIONS } from 'App/Domain/Log'
export default class InsertValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    page: schema.number.optional([rules.unsigned()]),
    limit: schema.number.optional([rules.unsigned()]),
    action: schema.enum.optional(ACTION_OPTIONS),
    from: schema.date.optional({}, [rules.requiredIfExists('to')]),
    to: schema.date.optional({}, [rules.requiredIfExists('from')]),
  })

  public messages = {}
}
