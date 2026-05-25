'use client'

import { io, Socket } from 'socket.io-client'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 5000,
    })

    socket.on('connect', () => {
      console.log('[Socket.IO] Conectado al servidor')
    })

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Desconectado del servidor')
    })
  }

  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
