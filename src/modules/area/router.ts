import { Router } from 'express'
import { areaController } from './controller'
import { isAdmin, isStaff } from '../../middleware/auth.middleware'

const router = Router()

router
  .route('/')
  .post(isAdmin, areaController.createArea.bind(areaController))
  .get(isAdmin || isStaff, areaController.getAreas.bind(areaController))

router
  .route('/:areaId')
  .get(isAdmin || isStaff, areaController.getAreaById.bind(areaController))
  .put(isAdmin, areaController.updateArea.bind(areaController))
  .delete(isAdmin, areaController.deleteArea.bind(areaController))

export default router
