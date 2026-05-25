import { Router } from 'express'
import newsRoutes from './news.routes'
import authRoutes from './auth.routes'

const router = Router()

router.use('/news', newsRoutes)
router.use('/auth', authRoutes)

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
