import { Router } from 'express'
import { CustomerController } from './controller'
import { isAuthenticated } from '../../middleware/auth.middleware'

const router = Router()
const controller = new CustomerController()

router.route('/').post(controller.createCustomer).get(isAuthenticated, controller.getCustomers)

router
  .route('/:customerId')
  .get(isAuthenticated, controller.getCustomerById)
  .put(isAuthenticated, controller.updateCustomer)

export default router
