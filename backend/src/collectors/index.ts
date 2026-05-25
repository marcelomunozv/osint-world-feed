import { Collector, RawNewsItem } from './types'
import { MockCollector } from './mock.collector'
import { NewsAPICollector } from './newsapi.collector'
import { GDELTCollector } from './gdelt.collector'
import { RSSCollector } from './rss.collector'
import { WikipediaCollector } from './wikipedia.collector'
import { config } from '../config'

/**
 * Fábrica de colectores. Retorna la lista activa según configuración.
 * En modo mock solo usa datos simulados; en producción usa todos los disponibles.
 */
export function getActiveCollectors(): Collector[] {
  if (config.useMocks) {
    return [new MockCollector()]
  }

  const collectors: Collector[] = [
    new RSSCollector(),
    new WikipediaCollector(),
  ]

  if (config.apis.newsapi.key) {
    collectors.push(new NewsAPICollector())
  }

  collectors.push(new GDELTCollector())

  return collectors
}

/**
 * Ejecuta todos los colectores activos y combina sus resultados.
 */
export async function collectAll(): Promise<RawNewsItem[]> {
  const collectors = getActiveCollectors()
  const allResults: RawNewsItem[] = []

  for (const collector of collectors) {
    try {
      console.log(`[Colector] Ejecutando: ${collector.name}`)
      const items = await collector.fetch()
      console.log(`[Colector] ${collector.name}: ${items.length} artículos obtenidos`)
      allResults.push(...items)
    } catch (error) {
      console.error(`[Colector] Error en ${collector.name}:`, (error as Error).message)
    }
  }

  return allResults
}
