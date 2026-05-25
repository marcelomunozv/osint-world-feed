'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { getSocket } from '@/lib/socket'
import dynamic from 'next/dynamic'
import { NewsFeed } from '@/components/news/NewsFeed'
import { TrendChart } from '@/components/charts/TrendChart'
import { EntityCloud } from '@/components/charts/EntityCloud'
import { FilterBar } from '@/components/ui/FilterBar'

const HeatMap = dynamic(() => import('@/components/map/HeatMap'), { ssr: false })
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
  const [refreshMinutes, setRefreshMinutes] = useState(2)
  const fetchRef = useRef(false)

  const fetchData = useCallback(async () => {
    fetchRef.current = true
    setError(null)

    try {
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
      fetchRef.current = false
    }
  }, [page, filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchRefCallback = useRef(fetchData)
  fetchRefCallback.current = fetchData

  useEffect(() => {
    const socket = getSocket()

    socket.on('breaking-news', (data: { count: number; items: any[] }) => {
      setBreakingNews((prev) => [...data.items, ...prev].slice(0, 10))
    })

    socket.on('feed-update', () => {
      fetchRefCallback.current()
    })

    return () => {
      socket.off('breaking-news')
      socket.off('feed-update')
    }
  }, [])

  useEffect(() => {
    const ms = refreshMinutes * 60 * 1000
    const id = setInterval(() => fetchRefCallback.current(), ms)
    return () => clearInterval(id)
  }, [refreshMinutes])

  const handleFilterChange = useCallback((newFilters: Record<string, string | undefined>) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  const handleDismissBreaking = useCallback((title: string) => {
    setBreakingNews((prev) => prev.filter((n) => n.title !== title))
  }, [])

  return (
    <div className="space-y-6">
      <BreakingNewsBanner items={breakingNews} onDismiss={handleDismissBreaking} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard OSINT
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitoreo global de noticias en tiempo real · {totalNews} eventos detectados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Tiempo real
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-osint-500 animate-pulse" />
            {trends.length} tendencias
          </span>
          <select
            value={refreshMinutes}
            onChange={(e) => setRefreshMinutes(Number(e.target.value))}
            className="text-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-osint-500"
            title="Intervalo de actualización"
          >
            <option value={1}>1 min</option>
            <option value={2}>2 min</option>
            <option value={3}>3 min</option>
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
          </select>
        </div>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Mapa de Calor Mundial
        </h2>
        <div className="h-[400px] news-card overflow-hidden">
          <HeatMap data={heatmapData} />
        </div>
      </section>

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
