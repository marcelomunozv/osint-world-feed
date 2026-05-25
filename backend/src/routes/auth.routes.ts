import { Router, Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

/**
 * POST /api/auth/register
 * Registro de nuevo usuario.
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña requeridos' })
      return
    }
    const result = await authService.register(email, password, name)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/auth/login
 * Inicio de sesión.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña requeridos' })
      return
    }
    const result = await authService.login(email, password)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/auth/profile
 * Perfil del usuario autenticado.
 */
router.get('/profile', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest
    const user = await authService.getProfile(authReq.userId!)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/auth/preferences
 * Actualizar preferencias del usuario.
 */
router.put('/preferences', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest
    const prefs = await authService.updatePreferences(authReq.userId!, req.body)
    res.json(prefs)
  } catch (error) {
    next(error)
  }
})

export default router
