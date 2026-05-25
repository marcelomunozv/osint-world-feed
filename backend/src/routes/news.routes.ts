import { Router, Request, Response, NextFunction } from 'express'
import { newsService } from '../services/news.service'
import { optionalAuth, AuthRequest } from '../middleware/auth'

const router = Router()

/**
 * GET /api/news
 * Listado paginado de noticias con filtros.
 */
router.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest
    let minScore: number | undefined

    // Si el usuario tiene preferencias, aplicar score mínimo
    if (authReq.userId) {
      // (opcional) cargar preferencias del usuario
    }

    const result = await newsService.getNews({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 50,
      country: req.query.country as string,
      source: req.query.source as string,
      status: req.query.status as string,
      search: req.query.search as string,
      minScore: minScore || (req.query.minScore ? parseFloat(req.query.minScore as string) : undefined),
      fromDate: req.query.fromDate as string,
      toDate: req.query.toDate as string,
      language: req.query.language as string,
    })

    res.json(result)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/news/heatmap
 * Datos geolocalizados para el mapa de calor.
 */
router.get('/heatmap', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await newsService.getHeatmapData()
    res.json(data)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/news/trends
 * Tópicos más populares del momento.
 */
router.get('/trends', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await newsService.getTrends()
    res.json(data)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/news/entities
 * Entidades para nube de palabras.
 */
router.get('/entities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const data = await newsService.getEntities(limit)
    res.json(data)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/news/:id
 * Detalle completo de una noticia.
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await newsService.getNewsById(req.params.id)
    if (!news) {
      res.status(404).json({ error: 'Noticia no encontrada' })
      return
    }
    res.json(news)
  } catch (error) {
    next(error)
  }
})

export default router
