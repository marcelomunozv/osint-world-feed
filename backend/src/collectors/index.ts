import { Collector, RawNewsItem } from './types'
import { MockCollector } from './mock.collector'
import { NewsAPICollector } from './newsapi.collector'
import { GDELTCollector } from './gdelt.collector'
import { GDELTTVCollector } from './gdelt-tv.collector'
import { RSSCollector } from './rss.collector'
import { WikipediaCollector } from './wikipedia.collector'
import { RedditCollector } from './reddit.collector'
import { WHOCollector } from './who.collector'
import { GitHubTrendingCollector } from './github.collector'
import { config } from '../config'

export function getActiveCollectors(): Collector[] {
  if (config.useMocks) {
    return [new MockCollector()]
  }

  return [
    new RSSCollector(),
    new WikipediaCollector(),
    new RedditCollector(),
    new WHOCollector(),
    new GitHubTrendingCollector(),
    new NewsAPICollector(),
    new GDELTCollector(),
    new GDELTTVCollector(),
  ]
}

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
