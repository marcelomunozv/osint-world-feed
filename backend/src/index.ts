import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { config } from './config'
import { connectDatabase } from './config/database'
import { getRedisClient } from './config/redis'
import routes from './routes'
import { errorHandler } from './middleware/errorHandler'
import { initWebSocket } from './websocket'
import { startCollectorScheduler } from './services/collector.service'

const app = express()
const httpServer = createServer(app)

// Middleware global
app.use(helmet())
app.use(cors())
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'))
app.use(express.json())

// Rutas
app.use('/api', routes)

// Manejador de errores
app.use(errorHandler)

// Inicialización del servidor
async function main() {
  try {
    // Conectar base de datos
    await connectDatabase()

    // Inicializar Redis
    getRedisClient()

    // Inicializar WebSocket
    initWebSocket(httpServer)

    // Iniciar colector programado
    if (config.nodeEnv !== 'test') {
      startCollectorScheduler()
    }

    // Iniciar servidor HTTP
    httpServer.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║        OSINT World Feed - Backend            ║
║  Puerto: ${config.port.toString().padEnd(33)}║
║  Entorno: ${config.nodeEnv.padEnd(33)}║
║  Mocks: ${config.useMocks ? 'Sí'.padEnd(35) : 'No'.padEnd(35)}║
╚══════════════════════════════════════════════╝
      `)
    })
  } catch (error) {
    console.error('Error al iniciar servidor:', error)
    process.exit(1)
  }
}

// Manejo graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido. Cerrando servidor...')
  httpServer.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT recibido. Cerrando servidor...')
  httpServer.close()
  process.exit(0)
})

main()
