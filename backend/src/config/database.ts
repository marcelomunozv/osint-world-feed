import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect()
    console.log('[DB] Conexión exitosa a la base de datos')
  } catch (error) {
    console.error('[DB] Error conectando a PostgreSQL:', error)
    process.exit(1)
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
  console.log('[DB] Desconectado de PostgreSQL')
}
