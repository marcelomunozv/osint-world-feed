import Redis from 'ioredis'
import { config } from './index'

let redisClient: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null
        return Math.min(times * 200, 3000)
      },
    })

    redisClient.on('connect', () => {
      console.log('[Redis] Conectado correctamente')
    })

    redisClient.on('error', (err) => {
      console.error('[Redis] Error:', err.message)
    })
  }
  return redisClient
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
    console.log('[Redis] Conexión cerrada')
  }
}
