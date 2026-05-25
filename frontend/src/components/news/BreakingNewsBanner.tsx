'use client'

import { useEffect, useState } from 'react'

interface BreakingNewsBannerProps {
  items: { title: string; importanceScore: number }[]
  onDismiss: (title: string) => void
}

export function BreakingNewsBanner({ items, onDismiss }: BreakingNewsBannerProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (items.length > 0) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [items])

  if (items.length === 0 || !visible) return null

  return (
    <div className="space-y-2">
      {items.slice(0, 3).map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-slide-in"
        >
          <span className="flex items-center gap-1.5 text-sm font-semibold text-red-700 dark:text-red-300 shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse-fast" />
            ÚLTIMA HORA
          </span>
          <p className="text-sm text-red-800 dark:text-red-200 flex-1 min-w-0 line-clamp-1">
            {item.title}
          </p>
          <span className="text-xs font-bold text-red-600 dark:text-red-400 shrink-0">
            {item.importanceScore}
          </span>
          <button
            onClick={() => onDismiss(item.title)}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-200 shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
