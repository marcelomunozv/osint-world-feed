'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { NewsFeed } from '@/components/news/NewsFeed'
import { exportToCSV, exportToJSON } from '@/lib/utils'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string | undefined>>({})
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [osintMode, setOsintMode] = useState(false)

  const searchNews = useCallback(async () => {
    if (!query && !filters.search) return

    setLoading(true)
    try {
      const result = await api.getNews({
        page,
        limit: 30,
        search: query || filters.search,
        ...filters,
      })
      setNews(result.items)
      setTotal(result.total)
    } catch (err) {
      console.error('Error en búsqueda:', err)
    } finally {
      setLoading(false)
    }
  }, [query, filters, page])

  useEffect(() => {
    if (query) searchNews()
  }, [searchNews, query])

  const handleExport = (format: 'csv' | 'json') => {
    const exportData = news.map((n) => ({
      id: n.id,
      title: n.title,
      source: n.sourceName,
      published: n.publishedAt,
      score: n.importanceScore,
      sentiment: n.sentimentLabel,
      country: n.country,
      url: n.url,
      ...(osintMode ? {
        raw: JSON.stringify(n),
      } : {}),
    }))

    if (format === 'csv') {
      exportToCSV(exportData, `osint-export-${Date.now()}`)
    } else {
      exportToJSON(exportData, `osint-export-${Date.now()}`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Búsqueda OSINT
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Busca entre miles de eventos globales por palabra clave, país, fuente o período
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="news-card p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Buscar eventos, lugares, personas..."
              className="w-full pl-10 pr-4 py-3 text-base rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osint-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            onClick={() => handleExport('json')}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Exportar JSON"
          >
            JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Exportar CSV"
          >
            CSV
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={osintMode}
              onChange={(e) => setOsintMode(e.target.checked)}
              className="rounded border-gray-300 dark:border-slate-600 text-osint-600 focus:ring-osint-500"
            />
            🕵️ Modo OSINT (incluir metadatos en exportación)
          </label>
        </div>
      </div>

      {/* Resultados */}
      {total > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {total} resultados para &ldquo;{query}&rdquo;
        </div>
      )}

      <NewsFeed
        items={news}
        loading={loading}
        page={page}
        totalPages={Math.ceil(total / 30)}
        onPageChange={setPage}
      />

      {!query && !loading && (
        <div className="text-center py-12">
          <span className="text-5xl">🔎</span>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Ingresa un término de búsqueda para comenzar
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Ej: terremoto, elecciones, ciberataque, COP30, SpaceX...
          </p>
        </div>
      )}
    </div>
  )
}
