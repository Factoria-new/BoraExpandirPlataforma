import { Router } from 'express'
import { healthController } from '../controllers/health.controller'
import { documentsController } from '../controllers/DocumentsController'
import ParceiroController from '../controllers/ParceiroController'
import calendarRoutes from './calendar'

const router = Router()

router.get('/ping', healthController.ping)

router.post('/documents/upload', documentsController.uploadDocument)

// Rotas do Google Calendar
router.use('/calendar', calendarRoutes)

export default router
