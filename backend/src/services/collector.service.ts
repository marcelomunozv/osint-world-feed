import cron from 'node-cron'
import { collectAll } from '../collectors'
import { processNewsItems } from '../processors'
import { newsService } from './news.service'
import { config } from '../config'
import { getIO } from '../websocket'
import { getRedisClient } from '../config/redis'

let isRunning = false

/**
 * Ejecuta el ciclo completo de recolección y procesamiento.
 */
export async function runCollectionCycle(): Promise<{
  collected: number
  saved: number
}> {
  if (isRunning) {
    console.log('[Collector] Ciclo anterior aún en ejecución, saltando...')
    return { collected: 0, saved: 0 }
  }

  isRunning = true
  console.log('[Collector] Iniciando ciclo de recolección...')

  try {
    // 1. Recolectar de todas las fuentes
    const rawItems = await collectAll()
    console.log(`[Collector] Total artículos crudos: ${rawItems.length}`)

    // 2. Procesar (dedup, entidades, sentimiento, resumen, ranking)
    const processed = processNewsItems(rawItems)
    console.log(`[Collector] Total artículos procesados: ${processed.length}`)

    // 3. Guardar en BD
    const saved = await newsService.saveNews(processed)
    console.log(`[Collector] Total artículos guardados: ${saved}`)

    // 4. Notificar noticias de último momento por WebSocket
    const breakingNews = processed.filter((n) => n.importanceScore >= 85)
    if (breakingNews.length > 0) {
      const io = getIO()
      io.emit('breaking-news', {
        count: breakingNews.length,
        items: breakingNews.slice(0, 5).map((n) => ({
          id: n.url,
          title: n.title,
          importanceScore: n.importanceScore,
          country: n.country,
          summary: n.summary,
        })),
      })
      console.log(`[WebSocket] ${breakingNews.length} noticias de último momento emitidas`)
    }

    return { collected: rawItems.length, saved }
  } catch (error) {
    console.error('[Collector] Error en ciclo:', (error as Error).message)
    return { collected: 0, saved: 0 }
  } finally {
    isRunning = false
  }
}

/**
 * Inicia el scheduler para recolectar noticias periódicamente.
 */
export function startCollectorScheduler(): void {
  const interval = config.collector.intervalMinutes

  console.log(`[Scheduler] Colector configurado cada ${interval} minutos`)

  // Ejecutar inmediatamente al iniciar
  runCollectionCycle()

  // Programar ejecución periódica
  cron.schedule(`*/${interval} * * * *`, () => {
    runCollectionCycle()
  })
}
