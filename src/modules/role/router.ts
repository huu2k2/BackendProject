import { Router } from 'express'
import { roleController } from './controller'

const router = Router()

router
  .route('/')
  .post(roleController.createRole.bind(roleController))
  .get(roleController.getRoles.bind(roleController))

router
  .route('/:roleId')
  .get(roleController.getRoleById.bind(roleController))
  .put(roleController.updateRole.bind(roleController))
  .delete(roleController.deleteRole.bind(roleController))

export default router
