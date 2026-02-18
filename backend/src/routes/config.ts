import { Router } from 'express'
import ConfigController from '../controllers/ConfigController'

const router = Router()

router.get('/:chave', ConfigController.getConfig)
router.post('/', ConfigController.setConfig)

export default router
