import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InsertValidator {
  constructor(protected ctx: HttpContextContract) {}

  public get data() {
    return {
      id: this.ctx.request.param('id'),
    }
  }

  public schema = schema.create({
    id: schema.string({}, [rules.uuid({ version: 4 })]),
  })

  public messages = {}
}
