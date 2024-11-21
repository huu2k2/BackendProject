import { Router } from 'express'
import { loginController } from './controller'

const router = Router()

router.route('/login').post(loginController.loginCustomer.bind(loginController))
router.route('/register').post(loginController.registerCustomer.bind(loginController))
router.route('/login/staff').post(loginController.loginStaff.bind(loginController))

export default router
