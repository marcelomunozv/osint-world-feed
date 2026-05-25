# 🌐 OSINT World Feed

**Panel de monitoreo de noticias mundiales en tiempo real con inteligencia de fuentes abiertas (OSINT).**

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Flujo de Datos](#flujo-de-datos)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Levantamiento con Docker](#levantamiento-con-docker)
- [Configuración](#configuración)
- [Uso](#uso)
- [Añadir Nuevas Fuentes](#añadir-nuevas-fuentes)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Modo OSINT](#modo-osint)

---

## Arquitectura

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Frontend   │◄───►│   Backend    │◄───►│ PostgreSQL  │
│  (Next.js)  │ WS  │  (Express)   │     │  + PostGIS  │
│  Puerto:3000│     │  Puerto:4000 │     │  Puerto:5432│
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │                     ▲
                           ▼                     │
                     ┌──────────┐          ┌──────────┐
                     │  Redis   │          │  Colect. │
                     │  Cache   │          │  Externos│
                     │  Puerto  │          │          │
                     │   :6379  │          │ NewsAPI  │
                     └──────────┘          │ GDELT    │
                                           │ RSS      │
                                           │ Wikipedia│
                                           └──────────┘
```

### 🧩 Patrón de Arquitectura

- **Microservicios ligeros**: frontend y backend como servicios independientes comunicados por REST + WebSockets.
- **Patrón Adaptador**: cada fuente de noticias implementa la interfaz `Collector`, facilitando añadir nuevas fuentes sin modificar el núcleo.
- **Pipeline de procesamiento**: recolección → deduplicación → NLP (entidades, sentimiento) → ranking → almacenamiento.
- **Cache distribuida**: Redis para reducir llamadas a APIs externas.
- **Tiempo real**: Socket.IO para notificaciones de última hora y actualizaciones del feed.

---

## Flujo de Datos

```
1. RECOLECCIÓN                   2. PROCESAMIENTO                  3. ENTREGA
┌─────────────────┐             ┌──────────────────┐             ┌─────────────────┐
│ NewsAPI         │             │ Deduplicación    │             │ API REST        │
│ GDELT 2.0       │──cron──►   │ (TF-IDF)         │──save──►   │ WebSockets      │
│ RSS Feeds       │             │ Extraer Entidades│             │ Socket.IO       │
│ Wikipedia       │             │ (compromise)     │             │ Cache (Redis)   │
│ Mock (dev)      │             │ Análisis Sentim. │             └────────┬────────┘
└─────────────────┘             │ (natural)        │                      │
                                │ Resumen          │                      ▼
                                │ Ranking          │             ┌─────────────────┐
                                └──────────────────┘             │ Dashboard React │
                                                                 │ Mapa Leaflet    │
                                                                 │ Charts D3.js    │
                                                                 │ Feed en Tiempo  │
                                                                 │ Real            │
                                                                 └─────────────────┘
```

---

## Stack Tecnológico

| Componente | Tecnología |
|------------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, TailwindCSS |
| **Visualización** | Leaflet (mapa calor), D3.js (charts, nube entidades) |
| **Backend** | Node.js, Express, TypeScript |
| **ORM** | Prisma + PostgreSQL + PostGIS |
| **Cache/Colas** | Redis (ioredis) |
| **NLP** | compromise (entidades), natural (sentimiento) |
| **Tiempo Real** | Socket.IO |
| **Autenticación** | JWT + bcryptjs |
| **Contenedores** | Docker, docker-compose |

---

## Requisitos

- Docker y Docker Compose v2+
- Node.js 20+ (para desarrollo local sin Docker)
- Git

---

## Levantamiento con Docker

### 1. Clonar el repositorio

```bash
git clone <url-repo> osint-world-feed
cd osint-world-feed
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus API keys (opcional en desarrollo)
```

### 3. Iniciar todos los servicios

```bash
docker-compose up -d
```

Esto levantará:
- **Frontend** en `http://localhost:3000`
- **Backend** en `http://localhost:4000`
- **PostgreSQL** en puerto `5432`
- **Redis** en puerto `6379`

### 4. Ejecutar migraciones y seed (primera vez)

```bash
# Entrar al contenedor del backend
docker-compose exec backend npx prisma migrate dev --name init

# Ejecutar seed de datos de prueba
docker-compose exec backend npx prisma db seed
```

### 5. Acceder

- **Dashboard**: http://localhost:3000
- **API Health**: http://localhost:4000/api/health
- **Usuario admin por defecto**: `admin@osintfeed.com` / `admin123`

---

## Configuración

Variables de entorno principales (`.env`):

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `POSTGRES_*` | Conexión a PostgreSQL | `osint_user` / `osint_pass_secure` |
| `REDIS_*` | Conexión a Redis | `localhost:6379` |
| `JWT_SECRET` | Secreto para JWT | `dev_secret_change_me` |
| `NEWSAPI_KEY` | API key de NewsAPI.org | *(vacío, usa mocks)* |
| `USE_MOCKS` | Usar datos simulados | `true` (desarrollo) |
| `COLLECTOR_INTERVAL_MINUTES` | Intervalo de recolección | `5` minutos |

---

## Uso

### Dashboard Principal

1. **Mapa de Calor Mundial**: visualiza la concentración geográfica de eventos.
2. **Gráfico de Tendencias**: tópicos más discutidos con indicador de sentimiento.
3. **Nube de Entidades**: personas, organizaciones y lugares destacados.
4. **Feed de Noticias**: lista cronológica con ranking de importancia.

### Filtros y Búsqueda

- Filtra por país, fuente, estado y score de importancia.
- Búsqueda por texto completo en la página `/search`.
- Exportación a JSON/CSV con modo OSINT.

### Detalle de Noticia

Cada noticia muestra:
- Fuentes que la cubren con enlaces.
- Entidades extraídas (personas, organizaciones, lugares).
- Análisis de sentimiento.
- Geolocalización.
- Línea de tiempo de cobertura.
- Metadatos OSINT (modo raw).

---

## Añadir Nuevas Fuentes

Gracias al **Patrón Adaptador**, añadir una nueva fuente es sencillo:

### 1. Crear el colector

Crea un archivo en `backend/src/collectors/`:

```typescript
import { Collector, RawNewsItem } from './types'

export class MiFuenteCollector implements Collector {
  readonly name = 'Mi Fuente'
  readonly sourceType = 'RSS' // o el tipo que corresponda

  async fetch(): Promise<RawNewsItem[]> {
    // Implementar lógica de recolección
    return []
  }
}
```

### 2. Registrar el colector

En `backend/src/collectors/index.ts`, añade tu colector:

```typescript
import { MiFuenteCollector } from './mifuente.collector'

export function getActiveCollectors(): Collector[] {
  return [
    // ... otros colectores
    new MiFuenteCollector(),
  ]
}
```

### 3. ¡Listo!

El pipeline de procesamiento (dedup, NLP, ranking) se aplicará automáticamente a los datos de tu nueva fuente.

---

## Estructura del Proyecto

```
osint-world-feed/
├── frontend/                    # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Dashboard principal
│   │   │   ├── layout.tsx       # Layout global
│   │   │   ├── globals.css      # Estilos globales
│   │   │   ├── login/           # Página de login
│   │   │   ├── register/        # Página de registro
│   │   │   ├── search/          # Búsqueda con exportación
│   │   │   ├── settings/        # Preferencias de usuario
│   │   │   └── news/[id]/       # Detalle de noticia
│   │   └── components/
│   │       ├── auth/            # AuthProvider
│   │       ├── ui/              # Navbar, FilterBar
│   │       ├── news/            # NewsFeed, NewsCard, BreakingNewsBanner
│   │       ├── map/             # HeatMap (Leaflet)
│   │       └── charts/          # TrendChart, EntityCloud (D3.js)
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── index.ts             # Entry point
│   │   ├── config/              # Configuración (DB, Redis, env)
│   │   ├── collectors/          # Adaptadores de fuentes
│   │   │   ├── types.ts         # Interfaz Collector
│   │   │   ├── mock.collector.ts
│   │   │   ├── newsapi.collector.ts
│   │   │   ├── gdelt.collector.ts
│   │   │   ├── rss.collector.ts
│   │   │   ├── wikipedia.collector.ts
│   │   │   └── index.ts         # Fábrica de colectores
│   │   ├── processors/          # NLP y ranking
│   │   │   ├── dedup.ts         # Deduplicación
│   │   │   ├── entities.ts      # Extracción de entidades
│   │   │   ├── sentiment.ts     # Análisis de sentimiento
│   │   │   ├── summary.ts       # Resumen automático
│   │   │   ├── ranking.ts       # Score de importancia
│   │   │   └── index.ts         # Pipeline completo
│   │   ├── routes/              # API REST
│   │   ├── services/            # Lógica de negocio
│   │   ├── middleware/          # Auth, error handler
│   │   ├── websocket/           # Socket.IO
│   │   └── utils/               # Cache, mock data
│   ├── prisma/
│   │   ├── schema.prisma        # Modelos DB
│   │   └── seed.ts              # Datos de prueba
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## API Endpoints

### Noticias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/news` | Lista paginada con filtros |
| GET | `/api/news/:id` | Detalle completo |
| GET | `/api/news/heatmap` | Datos geolocalizados |
| GET | `/api/news/trends` | Tendencias actuales |
| GET | `/api/news/entities` | Nube de entidades |

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Perfil (requiere auth) |
| PUT | `/api/auth/preferences` | Preferencias (requiere auth) |

### WebSockets (Socket.IO)

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `breaking-news` | Servidor → Cliente | Noticias de último momento |
| `feed-update` | Servidor → Cliente | Actualización del feed |

---

## Modo OSINT

El **Modo OSINT** está disponible en dos lugares:

1. **Página de búsqueda** (`/search`): activa el toggle para incluir metadatos en exportaciones JSON/CSV.

2. **Detalle de noticia** (`/news/:id`): sección expandible "Modo OSINT - Metadatos y datos crudos" que muestra el raw JSON de la noticia con:
   - ID interno, URL original, fuente y tipo
   - Marcas de tiempo (obtención, publicación)
   - Coordenadas geográficas precisas
   - Scores de sentimiento, importancia y credibilidad
   - Estado interno en el pipeline

3. **Preferencias de usuario** (`/settings`): activa el modo OSINT por defecto.
---
