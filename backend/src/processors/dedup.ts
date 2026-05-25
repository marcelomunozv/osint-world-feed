import { RawNewsItem } from '../collectors/types'

/**
 * Calcula similitud simple entre dos textos basada en palabras compartidas.
 * Se usa para detectar noticias duplicadas de distintas fuentes.
 */
function textSimilarity(a: string, b: string): number {
  const tokenize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-záéíóúñü0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)

  const tokensA = new Set(tokenize(a))
  const tokensB = new Set(tokenize(b))

  if (tokensA.size === 0 || tokensB.size === 0) return 0

  let intersection = 0
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection++
  }

  return intersection / Math.min(tokensA.size, tokensB.size)
}

/**
 * Agrupa noticias similares y retorna solo las únicas (con la de mayor longitud como representante).
 * El umbral de similitud determina qué tan parecidas deben ser para considerarse duplicadas.
 */
export function deduplicate(items: RawNewsItem[], threshold: number = 0.6): RawNewsItem[] {
  const unique: RawNewsItem[] = []

  for (const item of items) {
    let isDuplicate = false

    for (const existing of unique) {
      const sim = textSimilarity(item.title, existing.title)
      if (sim >= threshold) {
        isDuplicate = true
        break
      }
    }

    if (!isDuplicate) {
      unique.push(item)
    }
  }

  console.log(`[Dedup] ${items.length} -> ${unique.length} artículos únicos`)
  return unique
}
