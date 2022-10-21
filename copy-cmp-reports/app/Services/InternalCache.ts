import NodeCache from 'node-cache'

type Options = {
  stdTTL: number
}

export class InternalCache extends NodeCache {
  constructor(options: Partial<Options> = {}) {
    super({ stdTTL: 60 * 30, useClones: false, ...options })
  }

  public async fetchOrExecute<T>(key: string, action: () => Promise<T>, ttlSeconds = 600) {
    const maybeCache = this.get<Promise<T>>(key)

    if (maybeCache) return await maybeCache

    try {
      const promise = action()
      this.set(key, promise, ttlSeconds)
      const value = await promise
      if (!value) this.del(key)

      return value
    } catch (ex) {
      this.del(key)
      throw ex
    }
  }
}

export default new InternalCache()
