import { RawNewsItem } from '../collectors/types'

// Pesos para cada factor del ranking
const WEIGHTS = {
  MULTIPLE_SOURCES: 0.25,
  RECENCY: 0.2,
  SENTIMENT_IMPACT: 0.1,
  HAS_LOCATION: 0.1,
  HAS_ENTITIES: 0.1,
  CONTENT_LENGTH: 0.05,
  GEOPOLITICAL: 0.2,
}

// Países con mayor peso geopolítico
const GEOPOLITICAL_WEIGHT: Record<string, number> = {
  US: 1.0,
  CN: 1.0,
  RU: 0.9,
  GB: 0.8,
  FR: 0.7,
  DE: 0.7,
  IN: 0.7,
  JP: 0.6,
  BR: 0.6,
  EU: 0.8,
}

/**
 * Asigna un puntaje de importancia a cada artículo.
 * Combina: actualidad, fuentes múltiples, sentimiento, geolocalización y peso geopolítico.
 */
export function calculateImportanceScore(item: RawNewsItem): number {
  let score = 0

  // Actualidad: máximo puntaje para noticias de menos de 1 hora
  const hoursAge = (Date.now() - item.publishedAt.getTime()) / (1000 * 60 * 60)
  const recency = Math.max(0, 1 - hoursAge / 48)
  score += recency * WEIGHTS.RECENCY

  // Impacto por sentimiento extremo
  // (noticias muy negativas o muy positivas tienen más peso)
  if (item.description) {
    const negWords = (item.description.match(/ataque|terremoto|ciberataque|amenaza|crisis|guerra|muerte|alerta/gi) || []).length
    const posWords = (item.description.match(/acuerdo|histórico|avance|descubrimiento|tratamiento|éxito|lanzamiento/gi) || []).length
    const impact = Math.min(1, (negWords + posWords) / 5)
    score += impact * WEIGHTS.SENTIMENT_IMPACT
  }

  // Geolocalización
  if (item.latitude && item.longitude) {
    score += WEIGHTS.HAS_LOCATION
  }

  // Peso geopolítico del país
  if (item.country && GEOPOLITICAL_WEIGHT[item.country]) {
    score += GEOPOLITICAL_WEIGHT[item.country] * WEIGHTS.GEOPOLITICAL
  }

  // Contenido extenso (más completo)
  const contentLen = (item.content || '').length + (item.description || '').length
  if (contentLen > 100) {
    score += WEIGHTS.CONTENT_LENGTH
  }

  // Multiplicador base
  return Math.round(score * 100)
}
