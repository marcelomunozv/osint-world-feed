import fetch from 'node-fetch'
import { Collector, RawNewsItem } from './types'

/**
 * Colector para ReliefWeb (Oficina de la ONU para Asuntos Humanitarios).
 * Proporciona reportes de desastres, crisis humanitarias y emergencias.
 * API pública sin autenticación.
 */
export class ReliefWebCollector implements Collector {
  readonly name = 'ReliefWeb'
  readonly sourceType = 'RSS'

  async fetch(): Promise<RawNewsItem[]> {
    try {
      const url =
        'https://api.reliefweb.int/v2/reports?appname=osint-feed&profile=list&preset=latest&limit=30'
      const response = await fetch(url)
      if (!response.ok) throw new Error(`ReliefWeb error: ${response.status}`)

      const data = (await response.json()) as {
        data: Array<{
          id: string
          fields: {
            title?: string
            body?: string
            url?: string
            date?: { created?: string }
            source?: Array<{ name?: string }>
            country?: Array<{ name?: string; iso3?: string }>
          }
        }>
      }

      return data.data.map((item) => {
        const f = item.fields
        const country = f.country?.[0]
        return {
          title: f.title || 'Sin título',
          description: f.body?.replace(/<[^>]*>/g, '').slice(0, 300) || null,
          content: f.body?.replace(/<[^>]*>/g, '') || null,
          url: f.url || `https://reliefweb.int/report/${item.id}`,
          imageUrl: null,
          sourceName: f.source?.[0]?.name || 'ReliefWeb',
          sourceType: this.sourceType,
          publishedAt: f.date?.created ? new Date(f.date.created) : new Date(),
          country: country?.iso3 || null,
          latitude: null,
          longitude: null,
          locationName: country?.name || null,
          language: 'en',
        }
      })
    } catch (error) {
      console.error('[ReliefWeb] Error:', (error as Error).message)
      return []
    }
  }
}
