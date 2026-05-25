import fetch from 'node-fetch'
import { Collector, RawNewsItem } from './types'

const SUBREDDITS = ['worldnews', 'news', 'inthenews']

/**
 * Colector para Reddit.
 * Obtiene los posts más populares de subreddits de noticias.
 * Usa el JSON feed público (sin autenticación).
 */
export class RedditCollector implements Collector {
  readonly name = 'Reddit'
  readonly sourceType = 'RSS'

  async fetch(): Promise<RawNewsItem[]> {
    const results: RawNewsItem[] = []

    for (const sub of SUBREDDITS) {
      try {
        const url = `https://www.reddit.com/r/${sub}/hot.json?limit=15`
        const response = await fetch(url, {
          headers: { 'User-Agent': 'OSINT-World-Feed/1.0' },
        })
        if (!response.ok) throw new Error(`Reddit error: ${response.status}`)

        const data = (await response.json()) as {
          data: {
            children: Array<{
              data: {
                title: string
                selftext: string
                url: string
                thumbnail: string
                created_utc: number
                subreddit: string
                score: number
                num_comments: number
                domain: string
              }
            }>
          }
        }

        for (const child of data.data.children) {
          const d = child.data
          results.push({
            title: d.title,
            description: d.selftext?.slice(0, 300) || `[${d.subreddit}] ${d.score} puntos, ${d.num_comments} comentarios` || null,
            content: d.selftext || null,
            url: d.url.startsWith('/') ? `https://reddit.com${d.url}` : d.url,
            imageUrl: d.thumbnail?.startsWith('http') ? d.thumbnail : null,
            sourceName: `r/${d.subreddit}`,
            sourceType: this.sourceType,
            publishedAt: new Date(d.created_utc * 1000),
            country: null,
            latitude: null,
            longitude: null,
            locationName: null,
            language: 'en',
          })
        }
      } catch (error) {
        console.warn(`[Reddit] Error en r/${sub}:`, (error as Error).message)
      }
    }

    return results
  }
}
