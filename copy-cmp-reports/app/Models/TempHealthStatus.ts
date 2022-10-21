import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TempHealthStatus extends BaseModel {
  public static table = 'temp_health_status'

  @column({ isPrimary: true })
  public id: number

  @column()
  public circuitId: number

  @column()
  public dataCount: number

  @column()
  public healthStatus: string

  @column()
  public cmpDate: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
