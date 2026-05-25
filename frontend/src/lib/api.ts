const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

class ApiClient {
  private token: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('osint_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('osint_token', token)
      else localStorage.removeItem('osint_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }))
      throw new Error(error.error || `Error ${response.status}`)
    }

    return response.json()
  }

  // Noticias
  async getNews(params?: Record<string, string | number | undefined>) {
    const query = params
      ? '?' + Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
          .join('&')
      : ''

    return this.request<{
      items: any[]
      total: number
      page: number
      limit: number
    }>(`/news${query}`)
  }

  async getNewsById(id: string) {
    return this.request<any>(`/news/${id}`)
  }

  async getHeatmap() {
    return this.request<any[]>('/news/heatmap')
  }

  async getTrends() {
    return this.request<any[]>('/news/trends')
  }

  async getEntities(limit = 50) {
    return this.request<any[]>(`/news/entities?limit=${limit}`)
  }

  // Autenticación
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  }

  async register(email: string, password: string, name?: string) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    })
  }

  async getProfile() {
    return this.request<any>('/auth/profile')
  }

  async updatePreferences(prefs: Record<string, unknown>) {
    return this.request<any>('/auth/preferences', {
      method: 'PUT',
      body: prefs,
    })
  }
}

export const api = new ApiClient()
