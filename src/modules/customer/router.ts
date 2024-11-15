import { Router } from 'express'
import { CustomerController } from './controller'

const router = Router()
const controller = new CustomerController()

// Routes với middleware
router.route('/').post(controller.createCustomer).get(controller.getCustomers)

router.route('/:customerId').get(controller.getCustomerById).put(controller.updateCustomer)

export default router
