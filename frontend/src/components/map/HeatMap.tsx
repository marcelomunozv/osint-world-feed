'use client'

import { useEffect, useRef } from 'react'

interface HeatMapPoint {
  lat: number
  lng: number
  intensity: number
  title?: string
  location?: string
}

interface HeatMapProps {
  data: HeatMapPoint[]
}

function heatmapEqual(a: HeatMapPoint[], b: HeatMapPoint[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].lat !== b[i].lat || a[i].lng !== b[i].lng || a[i].intensity !== b[i].intensity) return false
  }
  return true
}

export default function HeatMap({ data }: HeatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const heatLayerRef = useRef<any>(null)
  const prevData = useRef<HeatMapPoint[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const initMap = async () => {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      const map = L.map(mapRef.current!, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map)

      mapInstance.current = map
    }

    initMap()

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current || data.length === 0) return
    if (heatmapEqual(prevData.current, data)) return
    prevData.current = data

    const map = mapInstance.current

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
    }

    import('leaflet').then((L) => {
      const points: Array<[number, number, number]> = data.map((p) => [
        p.lat,
        p.lng,
        p.intensity * 0.8,
      ])

      import('leaflet.heat').then(() => {
        heatLayerRef.current = (L as any).heatLayer(points, {
          radius: 25,
          blur: 15,
          maxZoom: 10,
          max: 1.0,
          gradient: {
            0.2: '#3498db',
            0.4: '#2ecc71',
            0.6: '#f1c40f',
            0.8: '#e67e22',
            1.0: '#e74c3c',
          },
        })

        map.addLayer(heatLayerRef.current)
      })
    })
  }, [data])

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <span className="text-3xl">🗺️</span>
          <p className="mt-2 text-sm">No hay datos geolocalizados disponibles</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full rounded-xl" />
}
