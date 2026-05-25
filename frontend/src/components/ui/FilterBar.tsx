'use client'

import { useState, useEffect, useCallback } from 'react'

interface FilterBarProps {
  onFilterChange: (filters: Record<string, string | undefined>) => void
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [source, setSource] = useState('')
  const [status, setStatus] = useState('')
  const [minScore, setMinScore] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const applyFilters = useCallback(() => {
    onFilterChange({
      search: search || undefined,
      country: country || undefined,
      source: source || undefined,
      status: status || undefined,
      minScore: minScore || undefined,
    })
  }, [search, country, source, status, minScore, onFilterChange])

  useEffect(() => {
    const timer = setTimeout(applyFilters, 500)
    return () => clearTimeout(timer)
  }, [applyFilters])

  const clearFilters = () => {
    setSearch('')
    setCountry('')
    setSource('')
    setStatus('')
    setMinScore('')
    onFilterChange({})
  }

  const hasFilters = search || country || source || status || minScore

  return (
    <div className="news-card p-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar noticias..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osint-500"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
            showFilters || hasFilters
              ? 'bg-osint-50 text-osint-700 border-osint-300 dark:bg-osint-900/30 dark:text-osint-300 dark:border-osint-700'
              : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          Filtros {hasFilters ? `(${[
            country && 'país',
            source && 'fuente',
            status && 'estado',
            minScore && 'score',
          ].filter(Boolean).length})` : ''}
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            <option value="">Todos los países</option>
            <option value="US">EE.UU.</option>
            <option value="CN">China</option>
            <option value="RU">Rusia</option>
            <option value="GB">Reino Unido</option>
            <option value="FR">Francia</option>
            <option value="DE">Alemania</option>
            <option value="IN">India</option>
            <option value="JP">Japón</option>
            <option value="BR">Brasil</option>
            <option value="CL">Chile</option>
            <option value="EU">Unión Europea</option>
          </select>

          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            <option value="">Todas las fuentes</option>
            <option value="NEWSAPI">NewsAPI</option>
            <option value="GDELT">GDELT</option>
            <option value="RSS">RSS</option>
            <option value="WIKIPEDIA">Wikipedia</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            <option value="">Todos los estados</option>
            <option value="BREAKING">Última hora</option>
            <option value="PENDING">Pendiente</option>
            <option value="VERIFIED">Verificado</option>
          </select>

          <select
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            <option value="">Cualquier importancia</option>
            <option value="90">Crítico (90+)</option>
            <option value="75">Alto (75+)</option>
            <option value="50">Medio (50+)</option>
          </select>
        </div>
      )}
    </div>
  )
}
