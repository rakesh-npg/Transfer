import {
  ensureNonEmptyString,
  ensureValidEnum,
  ensureArray,
  ensureHasValue,
} from './Helpers/Validations'
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'

// import logger from '@ioc:Adonis/Core/Logger'

export const ACTION_OPTIONS = [
  'TRUNCATE_HEALTH_STATUS_TABLE',
  'CLICK_HOUSE_DATA_POINTS',
  'HEALTH_STATUS',
  'SLACK_FILE_UPLOAD',
] as const

type Actions = typeof ACTION_OPTIONS[number]

export default class Log {
  constructor(
    public readonly id: string,
    public readonly action: Actions,
    public readonly ips: string[],
    public readonly blameUserId: string | null,
    public readonly message: string,
    public readonly createdAt: DateTime
  ) {
    this.id = ensureNonEmptyString(id, 'BAD_LOG_ID')
    this.action = ensureValidEnum(action, ACTION_OPTIONS, 'BAD_LOG_ACTION')
    this.ips = ensureArray(ips, 'BAD_LOG_IPS')
    this.blameUserId = blameUserId
      ? ensureNonEmptyString(blameUserId, 'BAD_LOG_BLAME_USER_ID')
      : null
    this.message = ensureNonEmptyString(message, 'BAD_LOG_MESSAGE')
    this.createdAt = ensureHasValue(createdAt, 'BAD_LOG_CREATED_AT_DATE')
  }

  // public print = () => {
  //   logger.info(this.message)
  //   return this.asJSONv1
  // }

  get asJSONv1() {
    return {
      id: this.id,
      action: this.action,
      ips: this.ips,
      blameUserId: this.blameUserId,
      message: this.message,
      createdAt: this.createdAt,
    }
  }

  public static fromJSON = (json: any) =>
    new Log(json.id, json.action, json.ips, json.blameUserId, json.message, json.createdAt)

  public static slackFileUpload = (ips: string[], userId: string) =>
    new Log(
      uuidv4(),
      'SLACK_FILE_UPLOAD',
      ips,
      null,
      `User (${userId}) accessed slack file upload.`,
      DateTime.now()
    )

  public static truncateHealthStatusTable = (ips: string[], userId: string) =>
    new Log(
      uuidv4(),
      'TRUNCATE_HEALTH_STATUS_TABLE',
      ips,
      null,
      `User (${userId}) truncated health status table.`,
      DateTime.now()
    )
}
