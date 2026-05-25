import fetch from 'node-fetch'
import { Collector, RawNewsItem } from './types'

/**
 * Colector para WHO (World Health Organization) RSS.
 * Proporciona alertas de salud global, brotes epidémicos y emergencias sanitarias.
 */
export class WHOCollector implements Collector {
  readonly name = 'WHO'
  readonly sourceType = 'RSS'

  async fetch(): Promise<RawNewsItem[]> {
    try {
      const url = 'https://www.who.int/rss-feeds/news-english.xml'
      const response = await fetch(url, {
        headers: { 'User-Agent': 'OSINT-World-Feed/1.0' },
      })
      if (!response.ok) throw new Error(`WHO error: ${response.status}`)

      const xml = await response.text()

      const items = xml.split(/<item>|<\/item>/g).filter((_, i) => i % 2 === 1)

      return items.slice(0, 20).map((item) => {
        const getTag = (tag: string) => {
          const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
          return m ? m[1].trim() : null
        }
        const getTagCDATA = (tag: string) => {
          const m = item.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, 'i'))
          return m ? m[1].trim() : null
        }

        const title = getTagCDATA('title') || getTag('title') || 'Sin título'
        const description = getTagCDATA('description') || getTag('description') || null
        const link = getTag('link') || ''
        const pubDate = getTag('pubDate') || getTag('dc:date') || undefined
        const guid = getTag('guid') || link

        return {
          title: title.replace(/<\/?[^>]+(>|$)/g, ''),
          description: description?.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 300) || null,
          content: description?.replace(/<\/?[^>]+(>|$)/g, '') || null,
          url: link || guid,
          imageUrl: null,
          sourceName: 'WHO (World Health Organization)',
          sourceType: this.sourceType,
          publishedAt: pubDate ? new Date(pubDate) : new Date(),
          country: null,
          latitude: null,
          longitude: null,
          locationName: null,
          language: 'en',
        }
      })
    } catch (error) {
      console.error('[WHO] Error:', (error as Error).message)
      return []
    }
  }
}
