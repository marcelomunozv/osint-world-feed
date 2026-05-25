/** Interfaz unificada para una noticia procesada por cualquier colector */
export interface RawNewsItem {
  title: string
  description: string | null
  content: string | null
  url: string
  imageUrl: string | null
  sourceName: string
  sourceType: string
  publishedAt: Date
  country: string | null
  latitude: number | null
  longitude: number | null
  locationName: string | null
  language: string
}

/** Interfaz que todo colector debe implementar (Patrón Adaptador) */
export interface Collector {
  readonly name: string
  readonly sourceType: string
  fetch(): Promise<RawNewsItem[]>
}
