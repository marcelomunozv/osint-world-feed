import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { config } from '../config'
import { AppError } from '../middleware/errorHandler'

export class AuthService {
  async register(email: string, password: string, name?: string) {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) throw new AppError(409, 'El email ya está registrado')

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    })

    // Crear preferencias por defecto
    await prisma.userPreference.create({
      data: { userId: user.id },
    })

    const token = this.generateToken(user.id, user.role)
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new AppError(401, 'Email o contraseña incorrectos')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new AppError(401, 'Email o contraseña incorrectos')

    const token = this.generateToken(user.id, user.role)
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    })
    if (!user) throw new AppError(404, 'Usuario no encontrado')
    return user
  }

  async updatePreferences(userId: string, data: {
    countries?: string[]
    topics?: string[]
    sources?: string[]
    minScore?: number
    language?: string
    osintMode?: boolean
  }) {
    return prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    })
  }

  private generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    })
  }
}

export const authService = new AuthService()
