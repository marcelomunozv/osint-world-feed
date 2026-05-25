import { RawNewsItem } from '../collectors/types'
import { deduplicate } from './dedup'
import { extractEntities, ExtractedEntity } from './entities'
import { analyzeSentiment } from './sentiment'
import { generateSummary } from './summary'
import { calculateImportanceScore } from './ranking'

export interface ProcessedNewsItem extends RawNewsItem {
  entities: ExtractedEntity[]
  sentimentLabel: string
  sentimentScore: number
  summary: string | null
  importanceScore: number
}

/**
 * Pipeline de procesamiento completo:
 * 1. Deduplicación
 * 2. Extracción de entidades
 * 3. Análisis de sentimiento
 * 4. Generación de resumen
 * 5. Cálculo de ranking/importancia
 */
export function processNewsItems(rawItems: RawNewsItem[]): ProcessedNewsItem[] {
  const unique = deduplicate(rawItems)

  return unique.map((item) => {
    const textToAnalyze = [item.title, item.description, item.content].filter(Boolean).join('. ')

    const entities = extractEntities(textToAnalyze)
    const sentiment = analyzeSentiment(textToAnalyze)
    const summary = generateSummary(item.content || item.description)
    const importanceScore = calculateImportanceScore(item)

    return {
      ...item,
      entities,
      sentimentLabel: sentiment.label,
      sentimentScore: sentiment.score,
      summary,
      importanceScore,
    }
  })
}
