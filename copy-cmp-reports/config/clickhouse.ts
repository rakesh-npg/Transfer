import Env from '@ioc:Adonis/Core/Env'

export const chT05 = {
  host: Env.get('CLICKHOUSE_T05_HOST'),
  dataObjects: true,
  readonly: true,
  port: Env.get('CLICKHOUSE_T05_PORT'),
  username: Env.get('CLICKHOUSE_T05_USER'),
  password: Env.get('CLICKHOUSE_T05_PASSWORD'),
  compression: 'zstd',
  isUseGzip: true,
  usePost: true,
}

export const chT05Stream = {
  host: Env.get('CLICKHOUSE_T05_HOST'),
  readonly: true,
  usePost: true,
  port: Env.get('CLICKHOUSE_T05_PORT'),
  username: Env.get('CLICKHOUSE_T05_USER'),
  password: Env.get('CLICKHOUSE_T05_PASSWORD'),
}
