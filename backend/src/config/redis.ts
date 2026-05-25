/**
 * Caché en memoria (reemplaza a Redis cuando no hay Docker).
 * Implementa la misma interfaz que ioredis para compatibilidad.
 */

interface CacheEntry {
  value: string
  expiresAt: number
}

class InMemoryRedis {
  private store = new Map<string, CacheEntry>()
  private defaultTTL = 300

  constructor() {
    console.log('[Cache] Usando caché en memoria (sin Redis)')
  }

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.value
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + seconds * 1000,
    })
    return 'OK'
  }

  async set(key: string, value: string): Promise<'OK'> {
    return this.setex(key, this.defaultTTL, value)
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0
    for (const key of keys) {
      if (this.store.delete(key)) count++
    }
    return count
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
    const result: string[] = []
    for (const key of this.store.keys()) {
      if (regex.test(key)) result.push(key)
    }
    return result
  }

  async ping(): Promise<string> {
    return 'PONG'
  }

  async quit(): Promise<'OK'> {
    this.store.clear()
    return 'OK'
  }
}

let client: InMemoryRedis | null = null

export function getRedisClient(): InMemoryRedis {
  if (!client) {
    client = new InMemoryRedis()
  }
  return client
}

export async function closeRedis(): Promise<void> {
  if (client) {
    await client.quit()
    client = null
    console.log('[Cache] Caché en memoria cerrada')
  }
}
