import * as CmpBo from './Cmpbo'
import { ClickHouseService, ClickHouseStreamService } from './ClickHouse'
import Slack from './Slack'
import Config from '@ioc:Adonis/Core/Config'
import HtmlToPdf from './HtmlToPdf'
import Mailgun from './Mailgun'

const ClickHouse = new ClickHouseService(Config.get('clickhouse.chT05'))
const ClickHouseStream = new ClickHouseStreamService(Config.get('clickhouse.chT05Stream'))

export { CmpBo, ClickHouse, ClickHouseStream, Slack, HtmlToPdf, Mailgun }
