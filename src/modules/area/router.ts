import { Router } from 'express'
import { areaController } from './controller'
import { isAdmin, isAdminOrStaff, isStaff } from '../../middleware/auth.middleware'

const router = Router()

router
  .route('/')
  .post(isAdmin, areaController.createArea.bind(areaController))
  .get(isAdminOrStaff, areaController.getAreas.bind(areaController))

router
  .route('/:areaId')
  .get(isAdminOrStaff, areaController.getAreaById.bind(areaController))
  .put(isAdmin, areaController.updateArea.bind(areaController))
  .delete(isAdmin, areaController.deleteArea.bind(areaController))

export default router
