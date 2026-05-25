import { prisma } from '../config/database'
import { ProcessedNewsItem } from '../processors'
import { getOrSetCache, invalidateCache } from '../utils/cache'

const CACHE_TTL = 120

export class NewsService {
  async saveNews(items: ProcessedNewsItem[]): Promise<number> {
    let saved = 0

    for (const item of items) {
      try {
        const news = await prisma.news.upsert({
          where: { url: item.url },
          update: {
            description: item.description,
            content: item.content,
            sentimentLabel: item.sentimentLabel,
            sentimentScore: item.sentimentScore,
            summary: item.summary,
            importanceScore: item.importanceScore,
            status: item.importanceScore > 85 ? 'BREAKING' : 'PENDING',
          },
          create: {
            title: item.title,
            description: item.description,
            content: item.content,
            url: item.url,
            imageUrl: item.imageUrl,
            sourceName: item.sourceName,
            sourceId: `${item.sourceType}-${Date.now()}`,
            sourceType: item.sourceType,
            publishedAt: item.publishedAt,
            language: item.language,
            country: item.country,
            latitude: item.latitude,
            longitude: item.longitude,
            locationName: item.locationName,
            sentimentLabel: item.sentimentLabel,
            sentimentScore: item.sentimentScore,
            summary: item.summary,
            importanceScore: item.importanceScore,
            status: item.importanceScore > 85 ? 'BREAKING' : 'PENDING',
            credibilityScore: 0.5,
          },
        })

        if (item.entities.length > 0) {
          await prisma.newsEntity.deleteMany({ where: { newsId: news.id } })
          for (const entity of item.entities) {
            await prisma.newsEntity.create({
              data: {
                newsId: news.id,
                name: entity.name,
                type: entity.type,
                relevance: entity.relevance,
              },
            })
          }
        }

        saved++
      } catch (error) {
        console.error('[NewsService] Error guardando noticia:', (error as Error).message)
      }
    }

    await invalidateCache('news:*')
    return saved
  }

  async getNews(filters: {
    page?: number
    limit?: number
    country?: string
    source?: string
    status?: string
    search?: string
    minScore?: number
    fromDate?: string
    toDate?: string
    language?: string
    sortBy?: string
    sortDir?: string
  }) {
    const page = filters.page || 1
    const limit = Math.min(filters.limit || 50, 100)
    const skip = (page - 1) * limit

    const where: any = {}

    if (filters.country) where.country = filters.country
    if (filters.source) where.sourceType = filters.source
    if (filters.status) where.status = filters.status
    if (filters.minScore) where.importanceScore = { gte: filters.minScore }
    if (filters.language) where.language = filters.language
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }
    if (filters.fromDate || filters.toDate) {
      where.publishedAt = {}
      if (filters.fromDate) where.publishedAt.gte = new Date(filters.fromDate)
      if (filters.toDate) where.publishedAt.lte = new Date(filters.toDate)
    }

    const dir = filters.sortDir === 'asc' ? 'asc' as const : 'desc' as const
    const orderBy = filters.sortBy === 'date'
      ? { publishedAt: dir }
      : { importanceScore: dir }

    const cacheKey = `news:list:${JSON.stringify(filters)}`

    return getOrSetCache(
      cacheKey,
      async () => {
        const [items, total] = await Promise.all([
          prisma.news.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
              entities: { take: 5 },
            },
          }),
          prisma.news.count({ where }),
        ])

        const itemsWithCount = items.map((item) => ({
          ...item,
          _count: { sources: 0 },
        }))

        return { items: itemsWithCount, total, page, limit }
      },
      CACHE_TTL
    )
  }

  async getNewsById(id: string) {
    return prisma.news.findUnique({
      where: { id },
      include: {
        entities: true,
        sources: true,
        timeline: { orderBy: { timestamp: 'asc' } },
      },
    })
  }

  async getHeatmapData() {
    return getOrSetCache('news:heatmap', async () => {
      const items = await prisma.news.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
          status: { not: 'ARCHIVED' },
        },
        select: {
          id: true,
          title: true,
          latitude: true,
          longitude: true,
          importanceScore: true,
          sentimentLabel: true,
          country: true,
          locationName: true,
        },
        orderBy: { importanceScore: 'desc' },
        take: 500,
      })

      return items.map((i) => ({
        id: i.id,
        title: i.title,
        lat: i.latitude!,
        lng: i.longitude!,
        intensity: i.importanceScore / 100,
        sentiment: i.sentimentLabel,
        country: i.country,
        location: i.locationName,
      }))
    }, CACHE_TTL)
  }

  async getTrends() {
    return getOrSetCache('news:trends', async () => {
      const trends = await prisma.trend.findMany({
        orderBy: { count: 'desc' },
        take: 20,
      })
      return trends
    }, CACHE_TTL)
  }

  async getEntities(limit: number = 50) {
    return getOrSetCache('news:entities', async () => {
      const entities = await prisma.newsEntity.groupBy({
        by: ['name', 'type'],
        _count: { name: true },
        _avg: { relevance: true },
        orderBy: { _count: { name: 'desc' } },
        take: limit,
      })

      return entities.map((e) => ({
        name: e.name,
        type: e.type,
        count: e._count.name,
        relevance: e._avg.relevance || 0,
      }))
    }, CACHE_TTL)
  }
}

export const newsService = new NewsService()
