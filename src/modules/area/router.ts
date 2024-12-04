import { Router } from 'express'
import { areaController } from './controller'
import { isManager, isManagerOrStaff, isStaff } from '../../middleware/auth.middleware'

const router = Router()

router
  .route('/')
  .post(isManager, areaController.createArea.bind(areaController))
  .get(isManagerOrStaff, areaController.getAreas.bind(areaController))

router
  .route('/:areaId')
  .get(isManagerOrStaff, areaController.getAreaById.bind(areaController))
  .put(isManager, areaController.updateArea.bind(areaController))
  .delete(isManager, areaController.deleteArea.bind(areaController))

export default router
