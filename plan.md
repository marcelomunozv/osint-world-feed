# Plan de Trabajo: OSINT World Feed

## 📋 Resumen

Aplicación web completa tipo dashboard OSINT que recolecta, procesa y muestra noticias mundiales en tiempo real. Stack: Next.js + Express + SQLite/PostgreSQL + Redis + Docker.

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
- [x] `start.sh`: script de inicio rápido

### Fase 1 — Backend: Modelos y Base de Datos ✓
- [x] `prisma/schema.prisma`: 8 modelos (User, UserPreference, News, NewsEntity, NewsSource, NewsTimeline, NewsBookmark, Trend, CacheEntry)
- [x] Migrado a SQLite para desarrollo sin Docker
- [x] `backend/src/config/index.ts`: carga de variables de entorno
- [x] `backend/src/config/database.ts`: conexión Prisma
- [x] `backend/src/config/redis.ts`: caché en memoria (reemplaza Redis sin Docker)
- [x] `backend/prisma/seed.ts`: datos de prueba (admin, tendencias)

### Fase 2 — Backend: Colectores (Patrón Adaptador) ✓
- [x] `collectors/types.ts`: interfaz `Collector` y tipo `RawNewsItem`
- [x] **6 colectores reales activos**:
  - `rss.collector.ts`: BBC, Guardian, NYT, Reuters, Al Jazeera
  - `wikipedia.collector.ts`: Wikipedia RecentChanges
  - `reddit.collector.ts`: r/worldnews, r/news, r/inthenews
  - `who.collector.ts`: WHO (alertas sanitarias globales)
  - `github.collector.ts`: GitHub Trending (6 lenguajes)
  - `newsapi.collector.ts`: NewsAPI.org (requiere API key)
- [x] **2 colectores legacy** (endpoints cambiantes):
  - `gdelt.collector.ts`: GDELT 2.0 API
  - `gdelt-tv.collector.ts`: GDELT TV API
- [x] `mock.collector.ts`: datos simulados para desarrollo (desactivado en prod)

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
- [x] `services/news.service.ts`: CRUD con caché + orden dinámico (relevancia/fecha, ascendente/descendente)
- [x] `services/auth.service.ts`: registro, login, preferencias (arrays como JSON string para SQLite)
- [x] `services/collector.service.ts`: scheduler cron + WebSocket emitter
- [x] `routes/news.routes.ts`: `/api/news` con filtros, `/api/news/heatmap`, `/api/news/trends`, `/api/news/entities`
- [x] `routes/auth.routes.ts`: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`, `/api/auth/preferences`
- [x] `routes/index.ts`: enrutador principal + health check
- [x] `websocket/index.ts`: Socket.IO con eventos `breaking-news` y `feed-update`

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
- [x] `components/map/HeatMap.tsx`: mapa Leaflet con capa de calor (dynamic import, ssr: false)
- [x] `components/charts/TrendChart.tsx`: gráfico D3.js de barras con sentimiento (deepEqual)
- [x] `components/charts/EntityCloud.tsx`: nube de palabras D3.js (deepEqual)
- [x] `components/ui/FilterBar.tsx`: filtros avanzados (país, fuente, estado, score, fechas, orden)

### Fase 7 — Frontend: Mejoras de Rendimiento y UX ✓
- [x] Fix ciclo infinito de re-render en FilterBar (useRef + isFirstRender)
- [x] Fix flickering en D3 charts (deepEqual en dependencias)
- [x] Fix Leaflet SSR (dynamic import + ssr: false)
- [x] Memoización de callbacks en Dashboard (useCallback)
- [x] Selector de intervalo de refresco (1-15 min)
- [x] Orden por relevancia/fecha con toggle ascendente/descendente
- [x] Filtro por rango de fechas (Desde / Hasta)

### Fase 8 — Tiempo Real + Modo OSINT ✓
- [x] `components/news/BreakingNewsBanner.tsx`: banner de última hora con auto-dismiss
- [x] WebSocket integrado en dashboard (eventos `breaking-news` y `feed-update`)
- [x] `app/news/[id]/page.tsx`: detalle completo con fuentes, entidades, timeline, metadatos OSINT
- [x] `app/search/page.tsx`: búsqueda avanzada con exportación JSON/CSV + modo OSINT

### Fase 9 — Documentación ✓
- [x] `README.md`: documentación completa (arquitectura, setup, API, cómo añadir fuentes)
- [x] `plan.md`: este archivo de seguimiento

---

## 📦 Resumen de Archivos Generados

```
Total: 68 archivos
├── frontend/       (18 archivos TSX/TS)
├── backend/        (27 archivos TS + Prisma)
├── raíz           (8 archivos: docker-compose.yml, .env.example, .gitignore,
│                   README.md, plan.md, start.sh)
```

## 🔑 Características Implementadas

- [x] Agregador multi-fuente (6 colectores reales activos)
- [x] Patrón Adaptador para colectores intercambiables
- [x] Pipeline NLP: dedup, entidades, sentimiento, resumen, ranking
- [x] API REST con filtros (país, fuente, fecha, score, ordenamiento)
- [x] WebSockets para noticias de última hora
- [x] Mapa de calor mundial (Leaflet + dynamic import SSR)
- [x] Gráfico de tendencias (D3.js con deepEqual)
- [x] Nube de entidades (D3.js con deepEqual)
- [x] Autenticación JWT + preferencias de usuario
- [x] Selector de intervalo de refresco (1-15 min)
- [x] Orden por relevancia o fecha (asc/desc)
- [x] Filtro por rango de fechas
- [x] Modo OSINT con metadatos y exportación JSON/CSV
- [x] Responsive mobile-first
- [x] Tema oscuro/claro
- [x] Sin dependencia de Docker (SQLite + caché en memoria)
- [x] Script start.sh con kill agresivo de puertos

---

## 🚀 Cómo Levantar

```bash
# Sin Docker (recomendado para desarrollo)
./start.sh

# O manualmente en dos terminales:
# Terminal 1:
cd backend && npx tsx src/index.ts

# Terminal 2:
cd frontend && npx next dev -p 3000

# Con Docker (producción):
docker-compose up -d
docker-compose exec backend npx prisma migrate dev --name init
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
| GET | `/api/news` | Opcional | Lista paginada con filtros (sortBy, sortDir, fromDate, toDate, country, search, etc.) |
| GET | `/api/news/:id` | No | Detalle completo |
| GET | `/api/news/heatmap` | No | Datos geolocalizados |
| GET | `/api/news/trends` | No | Tendencias actuales |
| GET | `/api/news/entities` | No | Nube de entidades |
| POST | `/api/auth/register` | No | Registro |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/profile` | JWT | Perfil |
| PUT | `/api/auth/preferences` | JWT | Preferencias |

---

## 🌐 Fuentes OSINT Configuradas

| Colector | Fuente | Estado | Artículos/ciclo |
|----------|--------|--------|-----------------|
| `RSS` | BBC, Guardian, NYT, Reuters, Al Jazeera | ✅ | ~40 |
| `Wikipedia` | Wikipedia RecentChanges | ✅ | ~30 |
| `Reddit` | r/worldnews, r/news, r/inthenews | ✅ | ~45 |
| `WHO` | Alertas sanitarias OMS | ✅ | ~20 |
| `GitHub Trending` | 6 lenguajes (JS, Python, TS, Rust, Go, all) | ✅ | ~89 |
| `NewsAPI` | NewsAPI.org | ⏳ requiere API key | — |
| `GDELT` | GDELT 2.0 doc/query | ⏳ endpoint caído | — |
| `GDELT TV` | GDELT TV API | ⏳ endpoint caído | — |
| `Mock` | Datos simulados | 🧪 solo desarrollo | ~10 |

---

## 🧠 Pipeline de Datos

```
Fuentes externas
  ├── RSS (5 medios globales)
  ├── Wikipedia (recentchanges)
  ├── Reddit (3 subreddits)
  ├── WHO (alertas sanitarias)
  ├── GitHub Trending (6 lenguajes)
  ├── NewsAPI (requiere key)
  ├── GDELT 2.0 (endpoint inestable)
  └── Mock (desarrollo)
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
  ┌─ Prisma (SQLite / PostgreSQL)
  ├─ Caché en memoria (o Redis con Docker)
  └─ Socket.IO (eventos breaking-news, feed-update)
        │
        ▼ ── API REST + frontend React
  Dashboard ← Leaflet (mapa calor) + D3.js (trends, cloud) + Feed
```

---

## 🐳 Servicios Docker

| Servicio | Puerto | Depende de | Sin Docker |
|----------|--------|------------|------------|
| `frontend` (Next.js) | `3000` | backend | ✅ npm run dev |
| `backend` (Express) | `4000` | postgres, redis | ✅ npx tsx src/index.ts |
| `postgres` (PostGIS) | `5432` | — | ❌ usa SQLite |
| `redis` (Alpine) | `6379` | — | ❌ usa caché en memoria |

## 🔧 Fixes Aplicados (Post-lanzamiento inicial)

| Problema | Solución |
|----------|----------|
| Refresco constante (FilterBar loop) | `useRef` para callback + `isFirstRender` guard |
| D3 charts parpadeando | `deepEqual` para evitar redibujar con mismos datos |
| Leaflet `window is not defined` (SSR) | `next/dynamic` con `ssr: false` + imports dinámicos |
| WebSocket rebind en cada render | `useRef` para `fetchRefCallback` |
| EADDRINUSE al reiniciar | `start.sh` con fuser + pkill agresivo |
| ReliefWeb API v1 deprecada | Reemplazado por WHO Collector |
| GitHub scraping HTML cambiado | Regex actualizado |
