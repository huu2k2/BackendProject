import { Router } from 'express'
import { areaController } from './controller'

const router = Router()

router
  .route('/')
  .post(areaController.createArea.bind(areaController))
  .get(areaController.getAreas.bind(areaController))

router
  .route('/:areaId')
  .get(areaController.getAreaById.bind(areaController))
  .put(areaController.updateArea.bind(areaController))
  .delete(areaController.deleteArea.bind(areaController))

export default router
