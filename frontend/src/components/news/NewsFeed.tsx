'use client'

import { NewsCard } from './NewsCard'

interface NewsFeedProps {
  items: any[]
  loading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function NewsFeed({ items, loading, page, totalPages, onPageChange }: NewsFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="news-card p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="hidden sm:block w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          Cargando noticias...
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl">📭</span>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          No se encontraron noticias con los filtros actuales.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            Anterior
          </button>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
