import { Router } from 'express'
import { loginController } from './controller'

const router = Router()

router
  .route('/customer/login')
  .post(loginController.loginCustomer.bind(loginController))
  .post(loginController.registerCustomer.bind(loginController))

router
  .route('/staff/login')
  .post(loginController.loginStaff.bind(loginController))

export default router
