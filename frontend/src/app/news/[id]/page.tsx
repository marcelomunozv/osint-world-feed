'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { timeAgo, importanceLabel, sentimentIndicator, entityIcon } from '@/lib/utils'

export default function NewsDetailPage() {
  const params = useParams()
  const [news, setNews] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) return

    api.getNewsById(params.id as string)
      .then(setNews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl">🔍</span>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {error || 'Noticia no encontrada'}
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-osint-600 hover:text-osint-700 dark:text-osint-400">
          ← Volver al dashboard
        </Link>
      </div>
    )
  }

  const imp = importanceLabel(news.importanceScore)
  const sent = sentimentIndicator(news.sentimentScore ?? 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-osint-600 dark:hover:text-osint-400">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 dark:text-gray-300">{news.title?.slice(0, 50)}...</span>
      </div>

      {/* Cabecera */}
      <div className="news-card p-6">
        <div className="flex items-start gap-3 mb-4">
          {news.status === 'BREAKING' && (
            <span className="badge-breaking">ÚLTIMA HORA</span>
          )}
          <span className={`text-xs font-bold px-2 py-1 rounded ${imp.color}`}>
            {imp.label}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${sent.color} bg-gray-100 dark:bg-slate-700`}>
            {sent.icon} {news.sentimentLabel}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="font-medium text-osint-600 dark:text-osint-400">
            {news.sourceName}
          </span>
          <span>·</span>
          <span>{timeAgo(news.publishedAt)}</span>
          {news.locationName && (
            <>
              <span>·</span>
              <span>{news.locationName}</span>
            </>
          )}
          <span>·</span>
          <span>Score: {news.importanceScore}/100</span>
        </div>

        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        {news.description && (
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {news.description}
          </p>
        )}

        {news.content && (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
            {news.content}
          </p>
        )}

        <div className="mt-4">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-osint-600 hover:text-osint-700 dark:text-osint-400 dark:hover:text-osint-300"
          >
            Ver fuente original ↗
          </a>
        </div>
      </div>

      {/* Grid: Entidades + Sentimiento + Mapa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Entidades */}
        <div className="news-card p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Entidades Detectadas
          </h3>
          {news.entities && news.entities.length > 0 ? (
            <div className="space-y-2">
              {news.entities.map((e: any) => (
                <div key={e.id || e.name} className="flex items-center gap-2 text-sm">
                  <span>{entityIcon(e.type)}</span>
                  <span className="text-gray-700 dark:text-gray-300">{e.name}</span>
                  <span className="text-xs text-gray-400">({e.type})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No se detectaron entidades</p>
          )}
        </div>

        {/* Análisis de Sentimiento */}
        <div className="news-card p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Análisis de Sentimiento
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Etiqueta</span>
              <span className={`text-sm font-semibold ${sent.color}`}>
                {news.sentimentLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Score</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {news.sentimentScore?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Credibilidad</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {(news.credibilityScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Geolocalización */}
        <div className="news-card p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Geolocalización
          </h3>
          {news.latitude && news.longitude ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {news.locationName || 'Ubicación desconocida'}
              </p>
              <p className="text-xs text-gray-400">
                {news.latitude.toFixed(4)}, {news.longitude.toFixed(4)}
              </p>
              <p className="text-xs text-gray-400">
                País: {news.country || 'No especificado'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No geolocalizado</p>
          )}
        </div>
      </div>

      {/* Línea de Tiempo */}
      {news.timeline && news.timeline.length > 0 && (
        <div className="news-card p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Línea de Tiempo
          </h3>
          <div className="space-y-2">
            {news.timeline.map((t: any) => (
              <div key={t.id} className="flex items-start gap-3 text-sm">
                <div className="min-w-[80px] text-xs text-gray-400">
                  {new Date(t.timestamp).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="w-2 h-2 mt-1.5 rounded-full bg-osint-500 shrink-0" />
                <div>
                  <span className="text-gray-700 dark:text-gray-300">{t.event}</span>
                  {t.sourceUrl && (
                    <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-osint-600 hover:underline">
                      fuente ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fuentes */}
      {news.sources && news.sources.length > 0 && (
        <div className="news-card p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Fuentes que cubren esta noticia ({news.sources.length})
          </h3>
          <div className="space-y-2">
            {news.sources.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">{s.sourceName}</span>
                  <span className="text-xs text-gray-400">({s.sourceType})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    Credibilidad: {(s.credibility * 100).toFixed(0)}%
                  </span>
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-osint-600 hover:text-osint-700 dark:text-osint-400 text-xs"
                  >
                    ir ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modo OSINT - Metadatos */}
      <details className="news-card p-4">
        <summary className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">
          🕵️ Modo OSINT - Metadatos y datos crudos
        </summary>
        <div className="mt-3 space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono whitespace-pre overflow-x-auto">
            {JSON.stringify(
              {
                id: news.id,
                url: news.url,
                source: news.sourceName,
                sourceType: news.sourceType,
                publishedAt: news.publishedAt,
                fetchedAt: news.fetchedAt,
                language: news.language,
                country: news.country,
                coordinates: news.latitude && news.longitude
                  ? { lat: news.latitude, lng: news.longitude }
                  : null,
                sentiment: { label: news.sentimentLabel, score: news.sentimentScore },
                importanceScore: news.importanceScore,
                credibilityScore: news.credibilityScore,
                status: news.status,
              },
              null,
              2
            )}
          </div>
        </div>
      </details>
    </div>
  )
}
