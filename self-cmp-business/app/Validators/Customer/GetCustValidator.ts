import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetCustValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional([rules.unsigned()]),
    offset: schema.number.optional([rules.unsigned()]),
    limit: schema.number.optional(), 
    regex: schema.string.optional(), 
    filter: schema.number.optional(), 
    orderbyColumn: schema.string.optional(), 
    orderbyValue : schema.string.optional()
  })

  public messages: CustomMessages = {}
}
