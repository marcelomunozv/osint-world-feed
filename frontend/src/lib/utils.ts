/**
 * Formatea una fecha relativa al momento actual.
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'hace unos segundos'
  if (diffMin < 60) return `hace ${diffMin} min`
  if (diffHour < 24) return `hace ${diffHour}h`
  if (diffDay < 7) return `hace ${diffDay}d`
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

/**
 * Formatea un score de importancia a etiqueta visual.
 */
export function importanceLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'CRÍTICO', color: 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-300' }
  if (score >= 75) return { label: 'ALTO', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300' }
  if (score >= 50) return { label: 'MEDIO', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-300' }
  return { label: 'BAJO', color: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300' }
}

/**
 * Obtiene emoji/icono según el tipo de entidad.
 */
export function entityIcon(type: string): string {
  switch (type) {
    case 'PERSON': return '👤'
    case 'ORGANIZATION': return '🏢'
    case 'LOCATION': return '📍'
    case 'EVENT': return '📅'
    default: return '🏷️'
  }
}

/**
 * Formatea el score de sentimiento a indicador visual.
 */
export function sentimentIndicator(score: number): { icon: string; color: string } {
  if (score > 0.3) return { icon: '🟢', color: 'text-green-600' }
  if (score < -0.3) return { icon: '🔴', color: 'text-red-600' }
  return { icon: '⚪', color: 'text-gray-400' }
}

/**
 * Exporta datos a CSV.
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h]
        const str = String(val ?? '')
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Exporta datos a JSON.
 */
export function exportToJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.json`
  a.click()
  URL.revokeObjectURL(url)
}
