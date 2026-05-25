import { getRedisClient } from '../config/redis'

const DEFAULT_TTL = 300 // 5 minutos

export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const redis = getRedisClient()

  try {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached) as T
    }
  } catch {
    // si redis falla, continuar sin caché
  }

  const data = await fetchFn()

  try {
    await redis.setex(key, ttl, JSON.stringify(data))
  } catch {
    // ignorar error de caché
  }

  return data
}

export async function invalidateCache(pattern: string): Promise<void> {
  const redis = getRedisClient()
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch {
    // ignorar
  }
}
