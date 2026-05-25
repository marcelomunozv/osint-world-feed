'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

const TOPICS = [
  'seguridad', 'geopolítica', 'medio ambiente', 'tecnología',
  'economía', 'salud', 'ciencia', 'deportes', 'cultura',
]

const COUNTRIES = [
  { code: 'US', name: 'EE.UU.' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Rusia' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'FR', name: 'Francia' },
  { code: 'DE', name: 'Alemania' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japón' },
  { code: 'BR', name: 'Brasil' },
  { code: 'CL', name: 'Chile' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'ES', name: 'España' },
]

export default function SettingsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [topics, setTopics] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [minScore, setMinScore] = useState(0)
  const [language, setLanguage] = useState('es')
  const [osintMode, setOsintMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user?.preferences) {
      setTopics(user.preferences.topics || [])
      setSelectedCountries(user.preferences.countries || [])
      setMinScore(user.preferences.minScore || 0)
      setLanguage(user.preferences.language || 'es')
      setOsintMode(user.preferences.osintMode || false)
    }
  }, [user])

  const toggleTopic = (topic: string) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  const toggleCountry = (code: string) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updatePreferences({
        topics,
        countries: selectedCountries,
        minScore,
        language,
        osintMode,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Error guardando preferencias:', err)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return <div className="text-center py-12 text-gray-400">Cargando...</div>
  }

  if (!isAuthenticated) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Preferencias
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Personaliza tu feed de noticias OSINT
        </p>
      </div>

      {/* Temas de interés */}
      <div className="news-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Temas de Interés
        </h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                topics.includes(topic)
                  ? 'bg-osint-50 text-osint-700 border-osint-300 dark:bg-osint-900/40 dark:text-osint-300 dark:border-osint-700'
                  : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Países de interés */}
      <div className="news-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Países de Interés
        </h2>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => toggleCountry(country.code)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                selectedCountries.includes(country.code)
                  ? 'bg-osint-50 text-osint-700 border-osint-300 dark:bg-osint-900/40 dark:text-osint-300 dark:border-osint-700'
                  : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {country.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros adicionales */}
      <div className="news-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Filtros Globales
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Score mínimo de importancia: {minScore}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-full accent-osint-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 (todo)</span>
              <span>50 (medio)</span>
              <span>100 (crítico)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Idioma preferido
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-osint-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={osintMode}
              onChange={(e) => setOsintMode(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-osint-600 focus:ring-osint-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🕵️ Modo OSINT
              </span>
              <p className="text-xs text-gray-400">
                Muestra metadatos y datos crudos de las noticias
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Botón guardar */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-osint-600 text-white font-medium hover:bg-osint-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar Preferencias'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 dark:text-green-400 animate-slide-in">
            ✓ Preferencias guardadas
          </span>
        )}
      </div>
    </div>
  )
}
