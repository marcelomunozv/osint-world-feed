import fetch from 'node-fetch'
import { Collector, RawNewsItem } from './types'

/**
 * Colector para la API de Wikipedia.
 * Obtiene eventos actuales desde la página "Portal:Actualidad".
 */
export class WikipediaCollector implements Collector {
  readonly name = 'Wikipedia'
  readonly sourceType = 'WIKIPEDIA'

  async fetch(): Promise<RawNewsItem[]> {
    try {
      const url =
        'https://es.wikipedia.org/w/api.php?action=query&list=recentchanges&rcnamespace=0&rclimit=30&format=json'
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Wikipedia error: ${response.status}`)

      const data = (await response.json()) as {
        query?: {
          recentchanges?: Array<{
            title: string
            timestamp: string
            comment?: string
          }>
        }
      }

      const changes = data.query?.recentchanges || []

      return changes.map((c) => ({
        title: c.title,
        description: c.comment || null,
        content: null,
        url: `https://es.wikipedia.org/wiki/${encodeURIComponent(c.title)}`,
        imageUrl: null,
        sourceName: 'Wikipedia',
        sourceType: this.sourceType,
        publishedAt: new Date(c.timestamp),
        country: null,
        latitude: null,
        longitude: null,
        locationName: null,
        language: 'es',
      }))
    } catch (error) {
      console.error('[Wikipedia] Error:', (error as Error).message)
      return []
    }
  }
}
