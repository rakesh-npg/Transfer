import Exceptions from 'App/Exceptions/ExceptionTypes'
import { DateTime } from 'luxon'

export function ensureHasValue<T>(obj: T, exception: string): T {
  if (!obj) throw Exceptions.invalid(exception)
  return obj
}

export function ensureBoolean(bool: boolean, exception: string): boolean {
  if (typeof bool !== 'boolean') throw Exceptions.invalid(exception)
  return bool
}

export function ensureArray<T>(array: T, exception: string): T {
  if (typeof array['length'] !== 'number') throw Exceptions.invalid(exception)
  if (typeof array['map'] !== 'function') throw Exceptions.invalid(exception)
  if (typeof array['forEach'] !== 'function') throw Exceptions.invalid(exception)

  return array
}

export function ensureNonEmptyString(text: string, exception: string): string {
  if (!text || typeof text !== 'string') throw Exceptions.invalid(exception)

  let trimmedText = text.trim()
  if (trimmedText.length === 0) throw Exceptions.invalid(exception)

  return trimmedText
}

export function ensureString(text: string, exception: string): string {
  if (!text || typeof text !== 'string') throw Exceptions.invalid(exception)

  let trimmedText = text.trim()

  return trimmedText
}

export function ensureEmail(text: string, exception: string): string {
  if (!text || typeof text !== 'string') throw Exceptions.invalid(exception)

  let trimmedText = text.trim()
  if (trimmedText.length === 0) throw Exceptions.invalid(exception)

  const chunks = text.split('@')
  if (chunks[0].length <= 1 || chunks[1].length <= 2) throw Exceptions.invalid(exception)

  return trimmedText
}

export function ensurePositiveInteger(
  i: number,
  exception: string,
  allowZero: boolean = true
): number {
  if (!i && typeof i !== 'number') throw Exceptions.invalid(exception)

  if (allowZero && i >= 0) return i

  if (!allowZero && i > 0) return i

  throw Exceptions.invalid(exception)
}

export function ensureValidEnum<T>(val: any, allowed: Readonly<T[]>, exception: string) {
  if (!val || !allowed.includes(val)) throw Exceptions.invalid(exception)
  return val as T
}

export function ensureValidDateTime(val: DateTime, exception: string) {
  if (!val.isValid) throw Exceptions.invalid(exception)
  return val
}
