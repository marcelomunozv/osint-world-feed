'use client'

import Link from 'next/link'
import { timeAgo, importanceLabel, sentimentIndicator } from '@/lib/utils'

interface NewsCardProps {
  item: {
    id: string
    title: string
    description?: string | null
    sourceName: string
    publishedAt: string
    importanceScore: number
    sentimentLabel?: string
    sentimentScore?: number
    country?: string | null
    locationName?: string | null
    imageUrl?: string | null
    entities?: { name: string; type: string }[]
    _count?: { sources: number }
    status?: string
  }
}

export function NewsCard({ item }: NewsCardProps) {
  const imp = importanceLabel(item.importanceScore)
  const sent = sentimentIndicator(item.sentimentScore ?? 0)
  const isBreaking = item.status === 'BREAKING' || item.importanceScore >= 85

  return (
    <Link href={`/news/${item.id}`}>
      <article className="news-card p-4 hover:ring-1 hover:ring-osint-500/50 transition-all animate-slide-in">
        <div className="flex items-start gap-4">
          {/* Indicador visual de importancia */}
          <div className="hidden sm:flex flex-col items-center min-w-[48px]">
            <span className={`text-xs font-bold px-2 py-1 rounded ${imp.color}`}>
              {imp.label}
            </span>
            {isBreaking && (
              <span className="mt-1 badge-breaking">ÚLTIMA HORA</span>
            )}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                {item.title}
              </h3>
              {isBreaking && (
                <span className="sm:hidden badge-breaking shrink-0">AHORA</span>
              )}
            </div>

            {item.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-osint-600 dark:text-osint-400">
                {item.sourceName}
              </span>
              <span>·</span>
              <span>{timeAgo(item.publishedAt)}</span>
              {item.locationName && (
                <>
                  <span>·</span>
                  <span>{item.locationName}</span>
                </>
              )}
              <span>·</span>
              <span>{sent.icon} {item.sentimentLabel}</span>
              {item._count && item._count.sources > 1 && (
                <>
                  <span>·</span>
                  <span>{item._count.sources} fuentes</span>
                </>
              )}
            </div>

            {/* Entidades */}
            {item.entities && item.entities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.entities.slice(0, 3).map((e, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                  >
                    {e.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Score de importancia para móvil */}
          <div className="sm:hidden flex flex-col items-center">
            <span className="text-lg font-bold text-osint-600 dark:text-osint-400">
              {item.importanceScore}
            </span>
            <span className="text-[10px] text-gray-400">score</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
