import { Router } from 'express'
import { loginController } from './controller'

const router = Router()

// login  customer
router.route('/login').post(loginController.loginCustomer.bind(loginController))
// register  customer
router.route('/register').post(loginController.registerCustomer.bind(loginController))

// login admin && bep && staff
router.route('/login/staff').post(loginController.loginStaff.bind(loginController))

export default router
