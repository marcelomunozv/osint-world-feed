import { Collector, RawNewsItem } from './types'
import { getMockNews } from '../utils/mockData'

/**
 * Colector simulado para desarrollo sin APIs externas.
 * Implementa la interfaz Collector (Patrón Adaptador).
 */
export class MockCollector implements Collector {
  readonly name = 'Mock'
  readonly sourceType = 'RSS'

  async fetch(): Promise<RawNewsItem[]> {
    const mockNews = getMockNews()
    return mockNews.map((n) => ({
      title: n.title,
      description: n.description,
      content: n.content,
      url: n.url,
      imageUrl: null,
      sourceName: n.sourceName,
      sourceType: n.sourceType,
      publishedAt: n.publishedAt,
      country: n.country,
      latitude: n.latitude,
      longitude: n.longitude,
      locationName: n.locationName,
      language: 'es',
    }))
  }
}
