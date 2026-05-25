import fetch from 'node-fetch'
import { Collector, RawNewsItem } from './types'
import { config } from '../config'

/**
 * Colector para GDELT 2.0 API (Global Database of Events, Language, and Tone).
 * Proporciona eventos globales geolocalizados con análisis de tono.
 */
export class GDELTCollector implements Collector {
  readonly name = 'GDELT'
  readonly sourceType = 'GDELT'

  private readonly baseUrl = config.apis.gdelt.baseUrl

  async fetch(): Promise<RawNewsItem[]> {
    try {
      // GDELT 2.0 API - búsqueda de artículos recientes
      const url = `${this.baseUrl}/doc/query?query=global&mode=artlist&format=json&maxrows=50&sort=datedesc`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`GDELT error: ${response.status}`)

      const data = (await response.json()) as {
        articles?: Array<{
          title: string
          url: string
          domain: string
          seendate: string
          image?: string
        }>
      }

      if (!data.articles) return []

      return data.articles.map((a) => ({
        title: a.title,
        description: null,
        content: null,
        url: a.url,
        imageUrl: a.image || null,
        sourceName: a.domain,
        sourceType: this.sourceType,
        publishedAt: new Date(
          `${a.seendate.slice(0, 4)}-${a.seendate.slice(4, 6)}-${a.seendate.slice(6, 8)}T${a.seendate.slice(8, 10)}:${a.seendate.slice(10, 12)}:00`
        ),
        country: null,
        latitude: null,
        longitude: null,
        locationName: null,
        language: 'en',
      }))
    } catch (error) {
      console.error('[GDELT] Error:', (error as Error).message)
      return []
    }
  }
}
