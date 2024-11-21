import { Router } from 'express'
import { CustomerController } from './controller'
import { isCustomer } from '../../middleware/auth.middleware'

const router = Router()
const controller = new CustomerController()

// Routes với middleware
router.route('/').post(controller.createCustomer).get(isCustomer, controller.getCustomers)

router.route('/:customerId').get(isCustomer, controller.getCustomerById).put(isCustomer, controller.updateCustomer)

export default router
