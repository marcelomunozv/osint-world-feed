import natural from 'natural'

const analyzer = new natural.SentimentAnalyzer('Spanish', natural.PorterStemmer, 'afinn')

/**
 * Analiza el sentimiento de un texto.
 * Retorna una etiqueta (positive/negative/neutral) y un score entre -1 y 1.
 */
export function analyzeSentiment(text: string): {
  label: 'positive' | 'negative' | 'neutral'
  score: number
} {
  if (!text || text.trim().length === 0) {
    return { label: 'neutral', score: 0 }
  }

  const tokens = new natural.WordTokenizer().tokenize(text)
  if (!tokens || tokens.length === 0) {
    return { label: 'neutral', score: 0 }
  }

  const score = analyzer.getSentiment(tokens)

  // normalizar a rango -1 a 1
  const normalized = Math.max(-1, Math.min(1, score / 10))

  let label: 'positive' | 'negative' | 'neutral'
  if (normalized > 0.1) label = 'positive'
  else if (normalized < -0.1) label = 'negative'
  else label = 'neutral'

  return { label, score: normalized }
}
