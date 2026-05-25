'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface EntityItem {
  name: string
  type: string
  count: number
  relevance: number
}

interface EntityCloudProps {
  data: EntityItem[]
}

const TYPE_COLORS: Record<string, string> = {
  PERSON: '#3b82f6',
  ORGANIZATION: '#8b5cf6',
  LOCATION: '#10b981',
  EVENT: '#f59e0b',
}

/**
 * Nube de palabras con D3.js para visualizar entidades extraídas.
 * El tamaño de la palabra indica su relevancia, el color su tipo.
 */
export function EntityCloud({ data }: EntityCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return

    const container = d3.select(containerRef.current)
    container.selectAll('*').remove()

    const width = containerRef.current.clientWidth
    const height = 300

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

    const maxCount = d3.max(data, (d) => d.count) || 1
    const sizeScale = d3.scaleLinear().domain([1, maxCount]).range([12, 36])

    // Posicionamiento en espiral
    const positions: Array<{ x: number; y: number; r: number }> = []
    const spiral = (t: number) => ({
      x: Math.cos(t) * t * 1.5,
      y: Math.sin(t) * t * 1.5,
    })

    const collides = (x: number, y: number, r: number) =>
      positions.some((p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < p.r + r + 4)

    const sorted = [...data].sort((a, b) => b.count - a.count)

    sorted.forEach((entity, index) => {
      const fontSize = sizeScale(entity.count)
      const entityWidth = entity.name.length * fontSize * 0.6
      const r = entityWidth / 2

      let x = 0
      let y = 0
      let t = 1
      let attempts = 0

      do {
        const pos = spiral(t)
        x = pos.x
        y = pos.y
        t += 0.3
        attempts++
      } while (collides(x, y, r) && attempts < 200)

      positions.push({ x, y, r })

      const color = TYPE_COLORS[entity.type] || '#6b7280'

      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', fontSize)
        .attr('fill', color)
        .attr('opacity', 0.8)
        .attr('cursor', 'pointer')
        .style('font-weight', entity.count > maxCount / 2 ? 'bold' : 'normal')
        .text(entity.name)
        .append('title')
        .text(`${entity.name} (${entity.type}) - ${entity.count} menciones`)
    })
  }, [data])

  if (data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <span className="text-3xl">☁️</span>
          <p className="mt-2 text-sm">No hay entidades disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div ref={containerRef} className="w-full" style={{ minHeight: '300px' }} />
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: '#3b82f6' }} /> Persona
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: '#8b5cf6' }} /> Organización
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: '#10b981' }} /> Lugar
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded" style={{ background: '#f59e0b' }} /> Evento
        </span>
      </div>
    </div>
  )
}
