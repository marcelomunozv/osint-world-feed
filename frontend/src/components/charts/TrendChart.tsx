'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface TrendItem {
  topic: string
  count: number
  velocity: number
  sentiment: number
  category?: string
}

interface TrendChartProps {
  data: TrendItem[]
}

function deepEqual(a: TrendItem[], b: TrendItem[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].topic !== b[i].topic || a[i].count !== b[i].count) return false
  }
  return true
}

export function TrendChart({ data }: TrendChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const prevData = useRef<TrendItem[]>([])

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return
    if (deepEqual(prevData.current, data)) return
    prevData.current = data

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 10, right: 100, bottom: 10, left: 120 }
    const width = svgRef.current.clientWidth
    const height = data.length * 32 + margin.top + margin.bottom

    svg.attr('viewBox', `0 0 ${width} ${height}`)
    svg.attr('height', height)

    const maxCount = d3.max(data, (d) => d.count) || 1
    const xScale = d3.scaleLinear().domain([0, maxCount]).range([0, width - margin.left - margin.right])

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Barras
    g.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('y', (_, i) => i * 32)
      .attr('height', 24)
      .attr('fill', (d) => {
        if (d.sentiment < -0.3) return '#ef4444'
        if (d.sentiment > 0.3) return '#22c55e'
        return '#6b7280'
      })
      .attr('rx', 4)
      .attr('width', 0)
      .transition()
      .duration(800)
      .attr('width', (d) => xScale(d.count))

    // Etiquetas de tópico
    g.selectAll('.topic-label')
      .data(data)
      .join('text')
      .attr('class', 'topic-label')
      .attr('x', -8)
      .attr('y', (_, i) => i * 32 + 16)
      .attr('text-anchor', 'end')
      .attr('fill', 'currentColor')
      .attr('class', 'text-xs text-gray-700 dark:text-gray-300')
      .text((d) => d.topic.length > 20 ? d.topic.slice(0, 18) + '...' : d.topic)

    // Valor numérico al final de la barra
    g.selectAll('.value-label')
      .data(data)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', (d) => xScale(d.count) + 6)
      .attr('y', (_, i) => i * 32 + 16)
      .attr('fill', 'currentColor')
      .attr('class', 'text-xs text-gray-500 dark:text-gray-400')
      .text((d) => d.count)

    // Indicador de velocidad (flecha)
    g.selectAll('.velocity-indicator')
      .data(data.filter((d) => d.velocity > 0.5))
      .join('text')
      .attr('class', 'velocity-indicator')
      .attr('x', width - margin.right - margin.left - 14)
      .attr('y', (_, i) => i * 32 + 16)
      .attr('fill', '#f59e0b')
      .attr('font-size', '10px')
      .text('▲')
  }, [data])

  if (data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <span className="text-3xl">📊</span>
          <p className="mt-2 text-sm">No hay tendencias disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full" style={{ minHeight: '200px' }} />
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500" /> Negativo
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500" /> Positivo
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-500" /> Neutral
        </span>
        <span className="flex items-center gap-1 text-amber-500">▲ Alta velocidad</span>
      </div>
    </div>
  )
}
