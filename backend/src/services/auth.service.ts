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

    const userData = user as any
    if (userData.preferences) {
      userData.preferences.countries = JSON.parse(userData.preferences.countries || '[]')
      userData.preferences.topics = JSON.parse(userData.preferences.topics || '[]')
      userData.preferences.sources = JSON.parse(userData.preferences.sources || '[]')
    }

    return userData
  }

  async updatePreferences(userId: string, data: {
    countries?: string[]
    topics?: string[]
    sources?: string[]
    minScore?: number
    language?: string
    osintMode?: boolean
  }) {
    const updateData: any = {}
    if (data.countries !== undefined) updateData.countries = JSON.stringify(data.countries)
    if (data.topics !== undefined) updateData.topics = JSON.stringify(data.topics)
    if (data.sources !== undefined) updateData.sources = JSON.stringify(data.sources)
    if (data.minScore !== undefined) updateData.minScore = data.minScore
    if (data.language !== undefined) updateData.language = data.language
    if (data.osintMode !== undefined) updateData.osintMode = data.osintMode

    return prisma.userPreference.upsert({
      where: { userId },
      update: updateData,
      create: { userId, ...updateData },
    })
  }

  private generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    })
  }
}

export const authService = new AuthService()
