import Parser from 'rss-parser'
import { Collector, RawNewsItem } from './types'

/**
 * Fuentes RSS predefinidas para agregación de noticias.
 */
const RSS_FEEDS = [
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://www.theguardian.com/world/rss',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://feeds.reuters.com/reuters/worldNews',
  'https://www.aljazeera.com/xml/rss/all.xml',
]

const parser = new Parser()

/**
 * Colector genérico para fuentes RSS.
 * Implementa la interfaz Collector (Patrón Adaptador).
 */
export class RSSCollector implements Collector {
  readonly name = 'RSS'
  readonly sourceType = 'RSS'

  private feeds: string[]

  constructor(feeds?: string[]) {
    this.feeds = feeds || RSS_FEEDS
  }

  async fetch(): Promise<RawNewsItem[]> {
    const results: RawNewsItem[] = []

    for (const feedUrl of this.feeds) {
      try {
        const feed = await parser.parseURL(feedUrl)
        const items = (feed.items || []).slice(0, 10)

        for (const item of items) {
          results.push({
            title: item.title || 'Sin título',
            description: item.contentSnippet?.slice(0, 300) || null,
            content: item.content || null,
            url: item.link || '',
            imageUrl: null,
            sourceName: feed.title || feedUrl,
            sourceType: this.sourceType,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            country: null,
            latitude: null,
            longitude: null,
            locationName: null,
            language: 'en',
          })
        }
      } catch (error) {
        console.warn(`[RSS] Error al leer ${feedUrl}:`, (error as Error).message)
      }
    }

    return results
  }
}
