import fetch from 'node-fetch'
import { Collector, RawNewsItem } from './types'

export class GitHubTrendingCollector implements Collector {
  readonly name = 'GitHub Trending'
  readonly sourceType = 'RSS'

  private readonly languages = ['', 'javascript', 'python', 'typescript', 'rust', 'go']

  async fetch(): Promise<RawNewsItem[]> {
    const results: RawNewsItem[] = []

    for (const lang of this.languages) {
      try {
        const url = lang
          ? `https://github.com/trending/${lang}?since=daily`
          : 'https://github.com/trending?since=daily'
        const response = await fetch(url, {
          headers: { 'User-Agent': 'OSINT-World-Feed/1.0' },
        })
        if (!response.ok) throw new Error(`GitHub error: ${response.status}`)

        const html = await response.text()

        const h2Regex = /<h2[^>]*class="[^"]*h3[^"]*"[^>]*>[\s\S]*?<a[^>]*href="\/([\w.-]+\/[\w.-]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h2>/gi
        const pRegex = /<p[^>]*class="col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/gi
        const starRegex = /svg[^>]*aria-label="star"[^>]*>[\s\S]*?<\/svg>\s*([\d,.kK]+)/gi

        const articles = html.split(/<article/gi).slice(1)

        for (const article of articles) {
          const h2Match = article.match(/<h2[^>]*>[\s\S]*?<a[^>]*href="\/([\w.-]+\/[\w.-]+)"[^>]*>/i)
          if (!h2Match) continue

          const repoFull = h2Match[1]
          const pMatch = article.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
          const description = pMatch
            ? pMatch[1].replace(/<[^>]*>/g, '').trim()
            : null

          const starMatch = article.match(/<span[^>]*>([\d,.kK]+)<\/span>\s*<span[^>]*>stars/i)
          const stars = starMatch ? starMatch[1] : '?'

          if (description && description.length > 0) {
            results.push({
              title: `${repoFull} — ${stars} ☆`,
              description: `[${lang || 'todos'}] ${description.slice(0, 300)}`,
              content: description,
              url: `https://github.com/${repoFull}`,
              imageUrl: null,
              sourceName: `GitHub Trending${lang ? ` (${lang})` : ''}`,
              sourceType: this.sourceType,
              publishedAt: new Date(),
              country: null,
              latitude: null,
              longitude: null,
              locationName: null,
              language: 'en',
            })
          }
        }
      } catch (error) {
        console.warn(`[GitHub] Error en ${lang}:`, (error as Error).message)
      }
    }

    return results
  }
}
