import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

enum OrderByColumn {
  Name = 'name', 
  Id = 'id'
}

enum OrderByValue {
  Desc = 'desc', 
  Asc = 'asc'
}

export default class GetCustValidator {
  
  
  constructor(protected ctx: HttpContextContract) {}



  public schema = schema.create({
    id: schema.array.optional().members(schema.number.optional([rules.unsigned()])),
    offset: schema.number.optional([rules.unsigned()]),
    limit: schema.number.optional([rules.unsigned()]), 
    regex: schema.string.optional(), 
    filter: schema.number.optional([rules.unsigned()]), 
    orderbyColumn: schema.enum.optional(Object.values(OrderByColumn)), 
    orderbyValue : schema.enum.optional(Object.values(OrderByValue))
  })

  public messages: CustomMessages = {}
}

