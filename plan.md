# Plan de Trabajo: OSINT World Feed

## 📋 Resumen

Aplicación web completa tipo dashboard OSINT que recolecta, procesa y muestra noticias mundiales en tiempo real. Stack: Next.js + Express + PostgreSQL + Redis + Docker.

---

## ✅ Fases Completadas

### Fase 0 — Estructura Base ✓
- [x] Creación de directorios: `frontend/`, `backend/`, `scripts/`
- [x] `docker-compose.yml` con 4 servicios (frontend, backend, postgres, redis)
- [x] `backend/package.json` con Express, Prisma, Socket.IO, compromise, natural
- [x] `frontend/package.json` con Next.js, Leaflet, D3.js, Socket.IO client
- [x] `backend/tsconfig.json` y `frontend/tsconfig.json`
- [x] `backend/Dockerfile` y `frontend/Dockerfile`
- [x] `frontend/tailwind.config.ts` con tema OSINT personalizado
- [x] `frontend/postcss.config.js`
- [x] `.env.example` con todas las variables documentadas
- [x] `.gitignore`

### Fase 1 — Backend: Modelos y Base de Datos ✓
- [x] `prisma/schema.prisma`: 8 modelos (User, UserPreference, News, NewsEntity, NewsSource, NewsTimeline, NewsBookmark, Trend, CacheEntry)
- [x] `backend/src/config/index.ts`: carga de variables de entorno
- [x] `backend/src/config/database.ts`: conexión Prisma
- [x] `backend/src/config/redis.ts`: conexión ioredis
- [x] `backend/prisma/seed.ts`: datos mock (admin, 10 noticias, tendencias)

### Fase 2 — Backend: Colectores (Patrón Adaptador) ✓
- [x] `collectors/types.ts`: interfaz `Collector` y tipo `RawNewsItem`
- [x] `collectors/mock.collector.ts`: datos simulados para desarrollo
- [x] `collectors/newsapi.collector.ts`: NewsAPI.org
- [x] `collectors/gdelt.collector.ts`: GDELT 2.0 API
- [x] `collectors/rss.collector.ts`: RSS genérico
- [x] `collectors/wikipedia.collector.ts`: Wikipedia API
- [x] `collectors/index.ts`: fábrica de colectores + función `collectAll()`

### Fase 3 — Backend: Procesadores NLP ✓
- [x] `processors/dedup.ts`: deduplicación por similitud de texto (TF-IDF simplificado)
- [x] `processors/entities.ts`: extracción de entidades (compromise)
- [x] `processors/sentiment.ts`: análisis de sentimiento (natural)
- [x] `processors/summary.ts`: resumen extractivo automático
- [x] `processors/ranking.ts`: score de importancia (actualidad, fuentes, sentimiento, geopolítica)
- [x] `processors/index.ts`: pipeline completo de procesamiento

### Fase 4 — Backend: API + WebSockets + Auth ✓
- [x] `middleware/auth.ts`: JWT (autenticación + opcional)
- [x] `middleware/errorHandler.ts`: manejo centralizado de errores
- [x] `services/news.service.ts`: CRUD con caché Redis
- [x] `services/auth.service.ts`: registro, login, preferencias
- [x] `services/collector.service.ts`: scheduler cron + WebSocket emitter
- [x] `routes/news.routes.ts`: `/api/news`, `/api/news/heatmap`, `/api/news/trends`, `/api/news/entities`
- [x] `routes/auth.routes.ts`: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`, `/api/auth/preferences`
- [x] `routes/index.ts`: enrutador principal + health check
- [x] `websocket/index.ts`: Socket.IO con eventos `breaking-news` y `feed-update`
- [x] `utils/cache.ts`: `getOrSetCache` con Redis
- [x] `utils/mockData.ts`: 10 noticias mock con datos realistas

### Fase 5 — Frontend: Layout y Componentes Base ✓
- [x] `app/layout.tsx`: layout global con Navbar + AuthProvider
- [x] `app/globals.css`: estilos TailwindCSS + tema oscuro/claro
- [x] `components/auth/AuthProvider.tsx`: contexto de autenticación
- [x] `components/ui/Navbar.tsx`: barra de navegación responsive
- [x] `lib/api.ts`: cliente API con autenticación
- [x] `lib/socket.ts`: cliente Socket.IO
- [x] `lib/utils.ts`: utilidades (timeAgo, export CSV/JSON, etc.)
- [x] `app/login/page.tsx`: login
- [x] `app/register/page.tsx`: registro
- [x] `app/settings/page.tsx`: preferencias de usuario

### Fase 6 — Frontend: Dashboard y Visualizaciones ✓
- [x] `app/page.tsx`: dashboard principal con datos en paralelo
- [x] `components/news/NewsCard.tsx`: tarjeta de noticia con score, sentimiento, entidades
- [x] `components/news/NewsFeed.tsx`: lista virtualizada con paginación y skeleton loading
- [x] `components/map/HeatMap.tsx`: mapa Leaflet con capa de calor
- [x] `components/charts/TrendChart.tsx`: gráfico D3.js de barras con sentimiento
- [x] `components/charts/EntityCloud.tsx`: nube de palabras D3.js con posicionamiento espiral
- [x] `components/ui/FilterBar.tsx`: filtros por país, fuente, estado, score

### Fase 7 — Frontend: Tiempo Real + Modo OSINT ✓
- [x] `components/news/BreakingNewsBanner.tsx`: banner de última hora con auto-dismiss
- [x] WebSocket integrado en dashboard: eventos `breaking-news` y `feed-update`
- [x] `app/news/[id]/page.tsx`: detalle completo con fuentes, entidades, timeline, metadatos OSINT
- [x] `app/search/page.tsx`: búsqueda avanzada con exportación JSON/CSV + modo OSINT

### Fase 8 — Documentación ✓
- [x] `README.md`: documentación completa (arquitectura, setup, API, cómo añadir fuentes)
- [x] `plan.md`: este archivo de seguimiento

---

## 📦 Resumen de Archivos Generados

```
Total: 62 archivos
├── frontend/       (16 archivos TSX/TS)
├── backend/        (22 archivos TS)
├── raíz           (6 archivos: docker-compose.yml, .env.example, .gitignore, README.md, plan.md)
```

## 🔑 Características Implementadas

- [x] Agregador multi-fuente (NewsAPI, GDELT, RSS, Wikipedia + Mock)
- [x] Patrón Adaptador para colectores intercambiables
- [x] Pipeline NLP: dedup, entidades, sentimiento, resumen, ranking
- [x] API REST con filtros, paginación y caché Redis
- [x] WebSockets para noticias de última hora
- [x] Mapa de calor mundial (Leaflet + PostGIS)
- [x] Gráfico de tendencias (D3.js)
- [x] Nube de entidades (D3.js)
- [x] Autenticación JWT + preferencias de usuario
- [x] Modo OSINT con metadatos y exportación JSON/CSV
- [x] Responsive mobile-first
- [x] Tema oscuro/claro
- [x] Datos mock para desarrollo offline
- [x] Docker compose multi-servicio

---

## 🚀 Cómo Levantar

```bash
# 1. Clonar y configurar
cp .env.example .env

# 2. Levantar servicios
docker-compose up -d

# 3. Migrar BD (primera vez)
docker-compose exec backend npx prisma migrate dev --name init

# 4. Cargar datos de prueba
docker-compose exec backend npx prisma db seed
```

Acceder a:
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:4000/api/health
- **Admin**: `admin@osintfeed.com` / `admin123`

---

## 🗺️ Mapa de Rutas (Frontend)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Dashboard | Feed, mapa calor, tendencias, nube entidades |
| `/news/[id]` | Detalle | Fuentes, entidades, sentimiento, timeline, OSINT raw |
| `/search` | Búsqueda | Filtros avanzados + exportación JSON/CSV |
| `/login` | Login | Inicio de sesión JWT |
| `/register` | Registro | Crear cuenta |
| `/settings` | Preferencias | Temas, países, score mínimo, modo OSINT |

---

## 🔌 Endpoints de la API

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| GET | `/api/news` | Opcional | Lista paginada con filtros |
| GET | `/api/news/:id` | No | Detalle completo |
| GET | `/api/news/heatmap` | No | Datos geolocalizados |
| GET | `/api/news/trends` | No | Tendencias actuales |
| GET | `/api/news/entities` | No | Nube de entidades |
| POST | `/api/auth/register` | No | Registro |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/profile` | JWT | Perfil |
| PUT | `/api/auth/preferences` | JWT | Preferencias |

## 🔌 WebSockets (Socket.IO)

| Evento | Dirección | Payload | Descripción |
|--------|-----------|---------|-------------|
| `connected` | → Cliente | `{ message }` | Confirmación de conexión |
| `breaking-news` | → Cliente | `{ count, items[] }` | Noticias de último momento |
| `feed-update` | → Cliente | (vacío) | Señal para refrescar el feed |

---

## 🧠 Pipeline de Datos

```
Fuentes externas
  ├── NewsAPI (top-headlines)
  ├── GDELT 2.0 (doc/query)
  ├── RSS (5 fuentes preconfiguradas)
  ├── Wikipedia (recentchanges)
  └── Mock (10 noticias simuladas)
        │
        ▼ ── colectores (patrón adaptador)
  collectAll()
        │
        ▼ ── pipeline de procesamiento
  ┌─ dedup           → similitud TF-IDF (threshold 0.6)
  ├─ extractEntities → compromise (PERSON, ORG, LOCATION)
  ├─ analyzeSentiment → natural (AFINN es)
  ├─ generateSummary → extractivo (primeras oraciones)
  └─ calculateImportanceScore → ranking ponderado
        │
        ▼ ── persistencia + tiempo real
  ┌─ Prisma (PostgreSQL + PostGIS)
  ├─ Redis (caché, TTL 2min)
  └─ Socket.IO (eventos breaking-news, feed-update)
        │
        ▼ ── API REST + frontend React
  Dashboard ← Leaflet (mapa calor) + D3.js (trends, cloud) + Feed
```

---

## 🏗️ Modelo de Datos (Prisma)

```
User (1)──(1) UserPreference
  │
  └──(N) NewsBookmark (N)──(1) News
                                │
                                ├──(N) NewsEntity
                                ├──(N) NewsSource
                                └──(N) NewsTimeline

Trend (independiente, agregación por tópico)
CacheEntry (independiente, clave-valor con TTL)
```

---

## 🐳 Servicios Docker

| Servicio | Puerto | Depende de |
|----------|--------|------------|
| `frontend` (Next.js) | `3000` | backend |
| `backend` (Express) | `4000` | postgres, redis |
| `postgres` (PostGIS) | `5432` | — |
| `redis` (Alpine) | `6379` | — |

Volúmenes persistentes: `postgres_data`, `redis_data`
