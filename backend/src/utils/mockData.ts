/**
 * Datos simulados para desarrollo sin APIs externas.
 * Genera un conjunto realista de noticias OSINT para pruebas.
 */

import { v4 as uuid } from 'uuid'

interface MockNews {
  id: string
  title: string
  description: string
  content: string
  url: string
  sourceName: string
  sourceType: string
  publishedAt: Date
  country: string
  latitude: number
  longitude: number
  locationName: string
  sentimentLabel: string
  sentimentScore: number
  importanceScore: number
  entities: { name: string; type: string; relevance: number }[]
}

const mockArticles: MockNews[] = [
  {
    id: uuid(),
    title: 'Terremoto de magnitud 7.1 sacude la costa de Japón',
    description: 'Un fuerte sismo de magnitud 7.1 se registró frente a la costa de Fukushima, Japón. Autoridades activan alerta de tsunami.',
    content: 'Un terremoto de magnitud 7.1 sacudió la costa este de Japón a las 14:32 hora local. El epicentro se localizó a 60 km de profundidad frente a la prefectura de Fukushima. La Agencia Meteorológica de Japón emitió una alerta de tsunami para las costas de Fukushima y Miyagi. No se reportan daños mayores de inmediato.',
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
    id: uuid(),
    title: 'Cumbre climática COP30 alcanza acuerdo histórico en Belém',
    description: 'Los países miembros acordaron reducir emisiones en un 60% para 2035 en un pacto sin precedentes.',
    content: 'La COP30 en Belém, Brasil, culminó con un acuerdo vinculante que establece metas ambiciosas de reducción de emisiones. El pacto incluye mecanismos de financiación para países en desarrollo por 500 mil millones de dólares anuales.',
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
    id: uuid(),
    title: 'Ciberataque masivo afecta infraestructura crítica en Europa',
    description: 'Grupos de hackers atacan sistemas gubernamentales en al menos 6 países europeos. La OTAN activa protocolos de respuesta.',
    content: 'Un ciberataque coordinado afectó sistemas de infraestructura crítica en Alemania, Francia, Países Bajos, Bélgica, Polonia y España. Los ataques se centraron en redes eléctricas y sistemas de comunicaciones. La OTAN ha activado su Centro de Ciberdefensa.',
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
    id: uuid(),
    title: 'Descubrimiento de yacimiento de litio en Chile podría transformar mercado global',
    description: 'El nuevo yacimiento en el Salar de Atacama duplicaría las reservas conocidas de litio a nivel mundial.',
    content: 'Codelco anunció el descubrimiento de un megayacimiento de litio en el Salar de Atacama. Las estimaciones preliminares indican reservas por más de 20 millones de toneladas, lo que convertiría a Chile en el mayor productor mundial.',
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
      { name: 'Salar de Atacama', type: 'LOCATION', relevance: 0.8 },
      { name: 'litio', type: 'EVENT', relevance: 0.9 },
    ],
  },
  {
    id: uuid(),
    title: 'Manifestaciones masivas en Francia por reforma de pensiones',
    description: 'Más de 2 millones de personas salen a las calles en todo el país en protesta por la nueva reforma.',
    content: 'Sindicatos franceses convocaron una jornada de protestas que paralizó el transporte público en París, Lyon y Marsella. La reforma propone aumentar la edad de jubilación de 62 a 65 años. El gobierno se mantiene firme en su posición.',
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
      { name: 'Marsella', type: 'LOCATION', relevance: 0.6 },
    ],
  },
  {
    id: uuid(),
    title: 'SpaceX lanza misión tripulada a la Estación Espacial Internacional',
    description: 'La misión Crew-12 despegó exitosamente desde Cabo Cañaveral con 4 astronautas a bordo.',
    content: 'SpaceX completó el lanzamiento de su misión Crew-12 rumbo a la ISS. La tripulación internacional incluye astronautas de NASA, ESA y JAXA. Es la duodécima misión comercial de SpaceX para la NASA.',
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
      { name: 'ISS', type: 'ORGANIZATION', relevance: 0.8 },
    ],
  },
  {
    id: uuid(),
    title: 'Nuevo récord de temperatura global: 2025 fue el año más cálido',
    description: 'El informe anual de la OMM confirma que 2025 superó todos los registros anteriores de temperatura media global.',
    content: 'La Organización Meteorológica Mundial confirmó que 2025 fue el año más cálido desde que hay registros, superando en 0.3°C el récord anterior. Los científicos advierten que nos acercamos peligrosamente al límite de 1.5°C del Acuerdo de París.',
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
    id: uuid(),
    title: 'Tensiones en el Mar de China Meridional: patrulla naval conjunta',
    description: 'China y países del sudeste asiático realizan patrullas conjuntas en medio de crecientes tensiones territoriales.',
    content: 'Una flota conjunta de China, Filipinas y Vietnam patrulla las disputadas aguas del Mar de China Meridional. El ejercicio busca reducir tensiones tras meses de enfrentamientos diplomáticos.',
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
      { name: 'Vietnam', type: 'LOCATION', relevance: 0.8 },
      { name: 'Mar de China Meridional', type: 'LOCATION', relevance: 0.95 },
    ],
  },
  {
    id: uuid(),
    title: 'Avance médico: nueva terapia génica cura enfermedad rara infantil',
    description: 'Un tratamiento innovador logró revertir los síntomas de la atrofia muscular espinal en ensayos clínicos.',
    content: 'Investigadores del Hospital Infantil de Boston anunciaron resultados prometedores de una nueva terapia génica para la atrofia muscular espinal tipo 1. El tratamiento mostró una eficacia del 95% en los 40 pacientes del ensayo.',
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
    id: uuid(),
    title: 'Elecciones generales en India: el BJP busca reelección histórica',
    description: 'Más de 900 millones de votantes están habilitados para las elecciones más grandes del mundo.',
    content: 'India celebra elecciones generales con el partido BJP del Primer Ministro Modi buscando un tercer mandato consecutivo. Los comicios se desarrollan en 7 fases durante 6 semanas. El resultado se espera para junio.',
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

export function getMockNews(): MockNews[] {
  return mockArticles
}

export function getMockTrends(): { topic: string; count: number; velocity: number; sentiment: number; category: string }[] {
  return [
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
}
