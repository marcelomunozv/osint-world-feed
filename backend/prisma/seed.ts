import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getMockNews, getMockTrends } from '../src/utils/mockData'

const prisma = new PrismaClient()

async function main() {
  console.log('[Seed] Iniciando carga de datos de prueba...')

  // Crear usuario administrador por defecto
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@osintfeed.com' },
    update: {},
    create: {
      email: 'admin@osintfeed.com',
      password: adminPassword,
      name: 'Admin OSINT',
      role: 'admin',
    },
  })

  await prisma.userPreference.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      countries: [],
      topics: ['seguridad', 'geopolítica', 'medio ambiente', 'tecnología'],
      sources: [],
      minScore: 0,
      language: 'es',
      osintMode: true,
    },
  })

  console.log(`[Seed] Usuario admin creado: admin@osintfeed.com / admin123`)

  // Cargar noticias mock
  const mockNews = getMockNews()
  for (const n of mockNews) {
    await prisma.news.upsert({
      where: { url: n.url },
      update: {},
      create: {
        title: n.title,
        description: n.description,
        content: n.content,
        url: n.url,
        imageUrl: null,
        sourceName: n.sourceName,
        sourceId: `mock-${n.id}`,
        sourceType: n.sourceType as any,
        publishedAt: n.publishedAt,
        language: 'es',
        country: n.country,
        latitude: n.latitude,
        longitude: n.longitude,
        locationName: n.locationName,
        sentimentLabel: n.sentimentLabel,
        sentimentScore: n.sentimentScore,
        summary: n.description,
        importanceScore: n.importanceScore,
        status: n.importanceScore > 85 ? 'BREAKING' : 'PENDING',
        credibilityScore: 0.5,
      },
    })

    // Crear entidades
    for (const e of n.entities) {
      await prisma.newsEntity.create({
        data: {
          id: `${n.id}-${e.name}-${e.type}`,
          newsId: n.id,
          name: e.name,
          type: e.type as any,
          relevance: e.relevance,
        },
      })
    }
  }

  console.log(`[Seed] ${mockNews.length} noticias de prueba cargadas`)

  // Cargar tendencias
  const trends = getMockTrends()
  for (const t of trends) {
    await prisma.trend.upsert({
      where: { topic: t.topic },
      update: { count: t.count, velocity: t.velocity, sentiment: t.sentiment, category: t.category },
      create: t,
    })
  }

  console.log(`[Seed] ${trends.length} tendencias cargadas`)
  console.log('[Seed] Carga completada exitosamente')
}

main()
  .catch((e) => {
    console.error('[Seed] Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
