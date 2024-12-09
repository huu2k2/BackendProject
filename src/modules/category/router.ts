import { Router } from 'express'
import { Controller } from './controller'
import { isAuthenticated, isManager, isManagerOrCustomer } from '../../middleware/auth.middleware'

const router = Router()
const controller = new Controller()

router.route('/')
.post(isAuthenticated ,isManager, controller.create)
.get( controller.getAll)

router
  .route('/:categoryId')
  .get(controller.getById)
  .put(isManager, controller.update)
  .delete(isManager, controller.delete)

export default router
