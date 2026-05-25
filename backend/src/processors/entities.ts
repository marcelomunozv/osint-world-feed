import nlp from 'compromise'

export interface ExtractedEntity {
  name: string
  type: 'PERSON' | 'ORGANIZATION' | 'LOCATION' | 'EVENT'
  relevance: number
}

/**
 * Extrae entidades nombradas de un texto usando compromise.
 * Retorna personas, organizaciones, lugares y eventos relevantes.
 */
export function extractEntities(text: string): ExtractedEntity[] {
  const doc = nlp(text)
  const entities: ExtractedEntity[] = []
  const seen = new Set<string>()

  const addEntity = (name: string, type: ExtractedEntity['type']) => {
    const key = `${type}:${name.toLowerCase()}`
    if (seen.has(key)) return
    seen.add(key)
    entities.push({ name, type, relevance: 0.5 })
  }

  // Personas
  const people = doc.people().out('array') as string[]
  people.forEach((p) => addEntity(p.trim(), 'PERSON'))

  // Organizaciones
  const orgs = doc.organizations().out('array') as string[]
  orgs.forEach((o) => addEntity(o.trim(), 'ORGANIZATION'))

  // Lugares
  const places = doc.places().out('array') as string[]
  places.forEach((p) => addEntity(p.trim(), 'LOCATION'))

  return entities
}
