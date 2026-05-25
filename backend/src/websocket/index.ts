import { Server as HTTPServer } from 'http'
import { Server } from 'socket.io'

let io: Server

/**
 * Inicializa Socket.IO para comunicación en tiempo real.
 * Eventos:
 *   - connection: cliente conectado
 *   - breaking-news: noticia de último momento (servidor -> cliente)
 *   - feed-update: actualización periódica del feed (servidor -> cliente)
 */
export function initWebSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingInterval: 30000,
    pingTimeout: 10000,
  })

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Cliente conectado: ${socket.id}`)

    // Unirse a sala de noticias de último momento
    socket.join('breaking')

    socket.on('subscribe:news', (newsId: string) => {
      socket.join(`news:${newsId}`)
    })

    socket.on('unsubscribe:news', (newsId: string) => {
      socket.leave(`news:${newsId}`)
    })

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Cliente desconectado: ${socket.id}`)
    })

    // Enviar confirmación
    socket.emit('connected', { message: 'Conectado al feed OSINT en tiempo real' })
  })

  console.log('[WebSocket] Socket.IO inicializado')
  return io
}

/**
 * Obtiene la instancia de Socket.IO para emitir eventos desde otros módulos.
 */
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado')
  }
  return io
}
