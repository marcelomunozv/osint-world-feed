import fetch from 'node-fetch'
import { Collector, RawNewsItem } from './types'

/**
 * Colector para GDELT TV API.
 * Monitorea segmentos de noticias de televisión a nivel global.
 * Usa el endpoint TV API del GDELT Project.
 */
export class GDELTTVCollector implements Collector {
  readonly name = 'GDELT TV'
  readonly sourceType = 'GDELT'

  async fetch(): Promise<RawNewsItem[]> {
    try {
      const url =
        'https://api.gdeltproject.org/api/v2/tv/tv?query=global&format=json&mode=clipgallery&maxclips=20'
      const response = await fetch(url)
      if (!response.ok) throw new Error(`GDELT TV error: ${response.status}`)

      const data = (await response.json()) as {
        clips?: Array<{
          id: string
          title: string
          description: string
          url: string
          thumbnail: string
          date: string
          station: string
          language: string
        }>
      }

      if (!data.clips) return []

      return data.clips.map((clip) => ({
        title: clip.title,
        description: clip.description?.slice(0, 300) || null,
        content: clip.description || null,
        url: clip.url,
        imageUrl: clip.thumbnail || null,
        sourceName: `${clip.station} (GDELT TV)`,
        sourceType: this.sourceType,
        publishedAt: new Date(clip.date),
        country: null,
        latitude: null,
        longitude: null,
        locationName: null,
        language: clip.language || 'en',
      }))
    } catch (error) {
      console.error('[GDELT TV] Error:', (error as Error).message)
      return []
    }
  }
}
