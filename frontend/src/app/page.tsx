'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { getSocket } from '@/lib/socket'
import { NewsFeed } from '@/components/news/NewsFeed'
import { HeatMap } from '@/components/map/HeatMap'
import { TrendChart } from '@/components/charts/TrendChart'
import { EntityCloud } from '@/components/charts/EntityCloud'
import { FilterBar } from '@/components/ui/FilterBar'
import { BreakingNewsBanner } from '@/components/news/BreakingNewsBanner'

export default function DashboardPage() {
  const [news, setNews] = useState<any[]>([])
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const [trends, setTrends] = useState<any[]>([])
  const [entities, setEntities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Record<string, string | undefined>>({})
  const [breakingNews, setBreakingNews] = useState<any[]>([])
  const [totalNews, setTotalNews] = useState(0)
  const [page, setPage] = useState(1)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [newsRes, heatmap, trendsData, entitiesData] = await Promise.all([
        api.getNews({ page, limit: 30, ...filters }),
        api.getHeatmap(),
        api.getTrends(),
        api.getEntities(40),
      ])

      setNews(newsRes.items)
      setTotalNews(newsRes.total)
      setHeatmapData(heatmap)
      setTrends(trendsData)
      setEntities(entitiesData)
    } catch (err) {
      setError((err as Error).message)
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // WebSocket para tiempo real
  useEffect(() => {
    const socket = getSocket()

    socket.on('breaking-news', (data: { count: number; items: any[] }) => {
      setBreakingNews((prev) => [...data.items, ...prev].slice(0, 10))
    })

    socket.on('feed-update', () => {
      fetchData()
    })

    return () => {
      socket.off('breaking-news')
      socket.off('feed-update')
    }
  }, [fetchData])

  const handleFilterChange = (newFilters: Record<string, string | undefined>) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Banner de noticias de último momento */}
      <BreakingNewsBanner items={breakingNews} onDismiss={(title) => {
        setBreakingNews((prev) => prev.filter((n) => n.title !== title))
      }} />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard OSINT
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitoreo global de noticias en tiempo real · {totalNews} eventos detectados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Tiempo real
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-osint-500 animate-pulse" />
            {trends.length} tendencias
          </span>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Mapa de Calor Mundial */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Mapa de Calor Mundial
        </h2>
        <div className="h-[400px] news-card overflow-hidden">
          <HeatMap data={heatmapData} />
        </div>
      </section>

      {/* Grid: Gráfico de tendencias + Nube de entidades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Tendencias
          </h2>
          <div className="news-card p-4">
            <TrendChart data={trends} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Entidades Destacadas
          </h2>
          <div className="news-card p-4">
            <EntityCloud data={entities} />
          </div>
        </section>
      </div>

      {/* Feed de Noticias */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Feed de Noticias
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalNews} resultados
          </span>
        </div>

        {error && (
          <div className="p-4 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <NewsFeed
          items={news}
          loading={loading}
          page={page}
          totalPages={Math.ceil(totalNews / 30)}
          onPageChange={setPage}
        />
      </section>
    </div>
  )
}
