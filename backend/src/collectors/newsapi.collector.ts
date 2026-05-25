import fetch from 'node-fetch'
import { Collector, RawNewsItem } from './types'
import { config } from '../config'

/**
 * Colector para NewsAPI.org
 * Obtiene titulares principales en múltiples idiomas.
 */
export class NewsAPICollector implements Collector {
  readonly name = 'NewsAPI'
  readonly sourceType = 'NEWSAPI'

  private readonly baseUrl = config.apis.newsapi.baseUrl
  private readonly apiKey = config.apis.newsapi.key

  async fetch(): Promise<RawNewsItem[]> {
    if (!this.apiKey) {
      console.warn('[NewsAPI] No hay API key configurada')
      return []
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/top-headlines?language=es&pageSize=50&apiKey=${this.apiKey}`
      )
      if (!response.ok) throw new Error(`NewsAPI error: ${response.status}`)

      const data = (await response.json()) as {
        articles: Array<{
          title: string
          description: string | null
          content: string | null
          url: string
          urlToImage: string | null
          source: { name: string }
          publishedAt: string
        }>
      }

      return data.articles.map((a) => ({
        title: a.title,
        description: a.description,
        content: a.content,
        url: a.url,
        imageUrl: a.urlToImage,
        sourceName: a.source.name,
        sourceType: this.sourceType,
        publishedAt: new Date(a.publishedAt),
        country: null,
        latitude: null,
        longitude: null,
        locationName: null,
        language: 'es',
      }))
    } catch (error) {
      console.error('[NewsAPI] Error:', (error as Error).message)
      return []
    }
  }
}
