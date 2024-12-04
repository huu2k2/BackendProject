import { Router } from 'express'
import { Controller } from './controller'
import { isManager, isManagerOrCustomer, isCustomer } from '../../middleware/auth.middleware'

const router = Router()
const controller = new Controller()

router.route('/').post(isManager, controller.create).get(isManagerOrCustomer, controller.getAll.bind(controller))

router
  .route('/:categoryId')
  .get(controller.getById)
  .put(isManager, controller.update)
  .delete(isManager, controller.delete)

export default router
