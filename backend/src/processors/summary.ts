/**
 * Genera un resumen extractivo simple.
 * Selecciona la primera oración significativa del contenido.
 * En producción se podría usar un modelo de IA más avanzado.
 */
export function generateSummary(text: string | null, maxLength: number = 150): string | null {
  if (!text || text.trim().length === 0) return null

  const clean = text.replace(/\s+/g, ' ').trim()

  if (clean.length <= maxLength) return clean

  // Tomar primeras oraciones hasta completar maxLength
  const sentences = clean.split(/[.!?]+/).filter(Boolean)
  let summary = ''

  for (const sentence of sentences) {
    if ((summary + sentence).length > maxLength) break
    summary += sentence.trim() + '. '
  }

  return summary.trim() || clean.slice(0, maxLength) + '...'
}
