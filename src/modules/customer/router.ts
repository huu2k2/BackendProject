import { Router } from 'express'
import { CustomerController } from './controller'
import { isAuthenticated, isCustomer } from '../../middleware/auth.middleware'

const router = Router()
const controller = new CustomerController()

// Routes với middleware
router.route('/').post(controller.createCustomer).get(isCustomer, controller.getCustomers)

router
  .route('/:customerId')
  .get(isAuthenticated || isCustomer, controller.getCustomerById)
  .put(isCustomer, controller.updateCustomer)

export default router
