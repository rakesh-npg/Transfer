/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  CLICKHOUSE_T05_HOST: Env.schema.string({ format: 'host' }),
  CLICKHOUSE_T05_PORT: Env.schema.number(),
  CLICKHOUSE_T05_USER: Env.schema.string(),
  CLICKHOUSE_T05_PASSWORD: Env.schema.string(),
  CLICKHOUSE_T05_NGP_TABLE: Env.schema.string(),
  CLICKHOUSE_T05_DB: Env.schema.string(),
  CLICKHOUSE_T05_TABLE: Env.schema.string(),
  DB_CONNECTION: Env.schema.string(),
  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),
  SLACK_BOT_TOKEN: Env.schema.string(),
  MISSING_ALERT_SLACK_CHANNEL: Env.schema.string(),
  MAILGUN_API_KEY: Env.schema.string(),
  MAILGUN_DOMAIN: Env.schema.string(),
  MAILGUN_HOST: Env.schema.string(),
})
