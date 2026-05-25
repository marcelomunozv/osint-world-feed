import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticación requerido' })
    return
  }

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; role: string }
    req.userId = decoded.userId
    req.userRole = decoded.role
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    const token = header.split(' ')[1]
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; role: string }
      req.userId = decoded.userId
      req.userRole = decoded.role
    } catch {
      // ignorar autenticación fallida en modo opcional
    }
  }
  next()
}
