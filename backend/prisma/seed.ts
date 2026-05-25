import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'

const prisma = new PrismaClient()

const mockArticles = [
  {
    title: 'Terremoto de magnitud 7.1 sacude la costa de Japón',
    description: 'Un fuerte sismo de magnitud 7.1 se registró frente a la costa de Fukushima. Autoridades activan alerta de tsunami.',
    content: 'Un terremoto de magnitud 7.1 sacudió la costa este de Japón a las 14:32 hora local. El epicentro se localizó a 60 km de profundidad frente a la prefectura de Fukushima. La Agencia Meteorológica de Japón emitió una alerta de tsunami.',
    url: 'https://ejemplo.com/noticias/terremoto-japon-1',
    sourceName: 'NHK World',
    sourceType: 'RSS',
    publishedAt: new Date(Date.now() - 1000 * 60 * 15),
    country: 'JP',
    latitude: 37.5,
    longitude: 141.0,
    locationName: 'Fukushima, Japón',
    sentimentLabel: 'negative',
    sentimentScore: -0.6,
    importanceScore: 92,
    entities: [
      { name: 'Japón', type: 'LOCATION', relevance: 0.95 },
      { name: 'Fukushima', type: 'LOCATION', relevance: 0.85 },
      { name: 'Agencia Meteorológica de Japón', type: 'ORGANIZATION', relevance: 0.7 },
    ],
  },
  {
    title: 'Cumbre climática COP30 alcanza acuerdo histórico en Belém',
    description: 'Los países miembros acordaron reducir emisiones en un 60% para 2035 en un pacto sin precedentes.',
    content: 'La COP30 en Belém, Brasil, culminó con un acuerdo vinculante que establece metas ambiciosas de reducción de emisiones. El pacto incluye mecanismos de financiación para países en desarrollo.',
    url: 'https://ejemplo.com/noticias/cop30-acuerdo-1',
    sourceName: 'BBC News',
    sourceType: 'NEWSAPI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60),
    country: 'BR',
    latitude: -1.455,
    longitude: -48.504,
    locationName: 'Belém, Brasil',
    sentimentLabel: 'positive',
    sentimentScore: 0.75,
    importanceScore: 88,
    entities: [
      { name: 'Brasil', type: 'LOCATION', relevance: 0.9 },
      { name: 'COP30', type: 'EVENT', relevance: 0.95 },
      { name: 'Belém', type: 'LOCATION', relevance: 0.8 },
    ],
  },
  {
    title: 'Ciberataque masivo afecta infraestructura crítica en Europa',
    description: 'Grupos de hackers atacan sistemas gubernamentales en al menos 6 países europeos.',
    content: 'Un ciberataque coordinado afectó sistemas de infraestructura crítica en Alemania, Francia, Países Bajos, Bélgica, Polonia y España. La OTAN ha activado su Centro de Ciberdefensa.',
    url: 'https://ejemplo.com/noticias/ciberataque-europa-1',
    sourceName: 'Reuters',
    sourceType: 'NEWSAPI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30),
    country: 'EU',
    latitude: 50.0,
    longitude: 10.0,
    locationName: 'Europa Central',
    sentimentLabel: 'negative',
    sentimentScore: -0.85,
    importanceScore: 95,
    entities: [
      { name: 'OTAN', type: 'ORGANIZATION', relevance: 0.9 },
      { name: 'Alemania', type: 'LOCATION', relevance: 0.8 },
      { name: 'Europa', type: 'LOCATION', relevance: 0.85 },
    ],
  },
  {
    title: 'Descubrimiento de yacimiento de litio en Chile',
    description: 'El nuevo yacimiento en el Salar de Atacama duplicaría las reservas conocidas de litio.',
    content: 'Codelco anunció el descubrimiento de un megayacimiento de litio en el Salar de Atacama. Las estimaciones indican reservas por más de 20 millones de toneladas.',
    url: 'https://ejemplo.com/noticias/litio-chile-1',
    sourceName: 'El Mercurio',
    sourceType: 'RSS',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120),
    country: 'CL',
    latitude: -23.5,
    longitude: -68.3,
    locationName: 'Salar de Atacama, Chile',
    sentimentLabel: 'positive',
    sentimentScore: 0.6,
    importanceScore: 78,
    entities: [
      { name: 'Chile', type: 'LOCATION', relevance: 0.95 },
      { name: 'Codelco', type: 'ORGANIZATION', relevance: 0.85 },
      { name: 'litio', type: 'EVENT', relevance: 0.9 },
    ],
  },
  {
    title: 'Manifestaciones masivas en Francia por reforma de pensiones',
    description: 'Más de 2 millones de personas salen a las calles en protesta por la nueva reforma.',
    content: 'Sindicatos franceses convocaron una jornada de protestas que paralizó el transporte público en París, Lyon y Marsella.',
    url: 'https://ejemplo.com/noticias/protestas-francia-1',
    sourceName: 'Le Monde',
    sourceType: 'RSS',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45),
    country: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    locationName: 'París, Francia',
    sentimentLabel: 'negative',
    sentimentScore: -0.7,
    importanceScore: 82,
    entities: [
      { name: 'Francia', type: 'LOCATION', relevance: 0.9 },
      { name: 'París', type: 'LOCATION', relevance: 0.85 },
    ],
  },
  {
    title: 'SpaceX lanza misión tripulada a la Estación Espacial Internacional',
    description: 'La misión Crew-12 despegó exitosamente desde Cabo Cañaveral con 4 astronautas.',
    content: 'SpaceX completó el lanzamiento de su misión Crew-12 rumbo a la ISS. Es la duodécima misión comercial de SpaceX para la NASA.',
    url: 'https://ejemplo.com/noticias/spacex-crew12-1',
    sourceName: 'NASA',
    sourceType: 'RSS',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90),
    country: 'US',
    latitude: 28.3922,
    longitude: -80.6077,
    locationName: 'Cabo Cañaveral, Florida',
    sentimentLabel: 'positive',
    sentimentScore: 0.8,
    importanceScore: 75,
    entities: [
      { name: 'SpaceX', type: 'ORGANIZATION', relevance: 0.95 },
      { name: 'NASA', type: 'ORGANIZATION', relevance: 0.85 },
      { name: 'Cabo Cañaveral', type: 'LOCATION', relevance: 0.7 },
    ],
  },
  {
    title: 'Nuevo récord de temperatura global: 2025 fue el año más cálido',
    description: 'El informe anual de la OMM confirma que 2025 superó todos los registros anteriores.',
    content: 'La Organización Meteorológica Mundial confirmó que 2025 fue el año más cálido desde que hay registros.',
    url: 'https://ejemplo.com/noticias/record-calor-2025-1',
    sourceName: 'The Guardian',
    sourceType: 'NEWSAPI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180),
    country: 'GL',
    latitude: 0,
    longitude: 0,
    locationName: 'Global',
    sentimentLabel: 'negative',
    sentimentScore: -0.5,
    importanceScore: 90,
    entities: [
      { name: 'OMM', type: 'ORGANIZATION', relevance: 0.85 },
      { name: 'Acuerdo de París', type: 'EVENT', relevance: 0.7 },
    ],
  },
  {
    title: 'Tensiones en el Mar de China Meridional',
    description: 'China y países del sudeste asiático realizan patrullas conjuntas.',
    content: 'Una flota conjunta de China, Filipinas y Vietnam patrulla las disputadas aguas del Mar de China Meridional.',
    url: 'https://ejemplo.com/noticias/mar-china-1',
    sourceName: 'Al Jazeera',
    sourceType: 'NEWSAPI',
    publishedAt: new Date(Date.now() - 1000 * 60 * 75),
    country: 'CN',
    latitude: 12.0,
    longitude: 115.0,
    locationName: 'Mar de China Meridional',
    sentimentLabel: 'negative',
    sentimentScore: -0.4,
    importanceScore: 80,
    entities: [
      { name: 'China', type: 'LOCATION', relevance: 0.9 },
      { name: 'Filipinas', type: 'LOCATION', relevance: 0.8 },
      { name: 'Mar de China Meridional', type: 'LOCATION', relevance: 0.95 },
    ],
  },
  {
    title: 'Avance médico: nueva terapia génica cura enfermedad rara infantil',
    description: 'Un tratamiento innovador logró revertir síntomas de atrofia muscular espinal.',
    content: 'Investigadores del Hospital Infantil de Boston anunciaron resultados de una nueva terapia génica para la atrofia muscular espinal tipo 1.',
    url: 'https://ejemplo.com/noticias/terapia-genica-1',
    sourceName: 'Nature Medicine',
    sourceType: 'RSS',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240),
    country: 'US',
    latitude: 42.3601,
    longitude: -71.0589,
    locationName: 'Boston, EE.UU.',
    sentimentLabel: 'positive',
    sentimentScore: 0.9,
    importanceScore: 85,
    entities: [
      { name: 'Boston', type: 'LOCATION', relevance: 0.7 },
      { name: 'Hospital Infantil de Boston', type: 'ORGANIZATION', relevance: 0.85 },
    ],
  },
  {
    title: 'Elecciones generales en India: el BJP busca reelección histórica',
    description: 'Más de 900 millones de votantes habilitados para las elecciones más grandes del mundo.',
    content: 'India celebra elecciones generales con el partido BJP del Primer Ministro Modi buscando un tercer mandato consecutivo.',
    url: 'https://ejemplo.com/noticias/elecciones-india-1',
    sourceName: 'The Times of India',
    sourceType: 'RSS',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    country: 'IN',
    latitude: 20.5937,
    longitude: 78.9629,
    locationName: 'India',
    sentimentLabel: 'neutral',
    sentimentScore: 0.0,
    importanceScore: 86,
    entities: [
      { name: 'India', type: 'LOCATION', relevance: 0.95 },
      { name: 'BJP', type: 'ORGANIZATION', relevance: 0.9 },
      { name: 'Modi', type: 'PERSON', relevance: 0.85 },
    ],
  },
]

const mockTrends = [
  { topic: 'Terremoto Japón', count: 245, velocity: 0.85, sentiment: -0.6, category: 'Desastre Natural' },
  { topic: 'COP30', count: 189, velocity: 0.72, sentiment: 0.75, category: 'Medio Ambiente' },
  { topic: 'Ciberataque Europa', count: 312, velocity: 0.95, sentiment: -0.85, category: 'Seguridad' },
  { topic: 'Litio Chile', count: 98, velocity: 0.45, sentiment: 0.6, category: 'Economía' },
  { topic: 'Protestas Francia', count: 167, velocity: 0.65, sentiment: -0.7, category: 'Política' },
  { topic: 'SpaceX Crew-12', count: 134, velocity: 0.55, sentiment: 0.8, category: 'Ciencia' },
  { topic: 'Récord Calor', count: 210, velocity: 0.78, sentiment: -0.5, category: 'Medio Ambiente' },
  { topic: 'Mar China', count: 156, velocity: 0.6, sentiment: -0.4, category: 'Geopolítica' },
  { topic: 'Terapia Génica', count: 89, velocity: 0.4, sentiment: 0.9, category: 'Salud' },
  { topic: 'Elecciones India', count: 178, velocity: 0.7, sentiment: 0.0, category: 'Política' },
]

async function main() {
  console.log('[Seed] Iniciando carga de datos de prueba...')

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
      countries: JSON.stringify([]),
      topics: JSON.stringify(['seguridad', 'geopolítica', 'medio ambiente', 'tecnología']),
      sources: JSON.stringify([]),
      minScore: 0,
      language: 'es',
      osintMode: true,
    },
  })

  console.log(`[Seed] Usuario admin: admin@osintfeed.com / admin123`)

  for (const n of mockArticles) {
    const newsId = uuid()
    await prisma.news.upsert({
      where: { url: n.url },
      update: {},
      create: {
        id: newsId,
        title: n.title,
        description: n.description,
        content: n.content,
        url: n.url,
        sourceName: n.sourceName,
        sourceId: `mock-${newsId}`,
        sourceType: n.sourceType,
        publishedAt: n.publishedAt,
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

    for (const e of n.entities) {
      await prisma.newsEntity.create({
        data: {
          id: uuid(),
          newsId,
          name: e.name,
          type: e.type,
          relevance: e.relevance,
        },
      })
    }
  }

  console.log(`[Seed] ${mockArticles.length} noticias cargadas`)

  for (const t of mockTrends) {
    await prisma.trend.upsert({
      where: { topic: t.topic },
      update: { count: t.count, velocity: t.velocity, sentiment: t.sentiment, category: t.category },
      create: { id: uuid(), ...t },
    })
  }

  console.log(`[Seed] ${mockTrends.length} tendencias cargadas`)
  console.log('[Seed] Carga completada')
}

main()
  .catch((e) => {
    console.error('[Seed] Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
