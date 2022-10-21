import { ClickHouse } from 'clickhouse'
import Env from '@ioc:Adonis/Core/Env'

export class ClickHouseService extends ClickHouse {
  public table: string
  public db: string

  constructor(config: ClickHouse) {
    super(config)
    this.table = Env.get('CLICKHOUSE_T05_TABLE')
    this.db = Env.get('CLICKHOUSE_T05_DB')
  }
}

export class ClickHouseStreamService extends ClickHouse {
  public table: string
  public db: string

  constructor(config: ClickHouse) {
    super(config)
    this.table = Env.get('CLICKHOUSE_T05_TABLE')
    this.db = Env.get('CLICKHOUSE_T05_DB')
  }
}
