import { Router } from 'express'
import { logoutController } from './controller'
import { isCustomer } from '../../middleware/auth.middleware'

const router = Router()

router.route('/staff').post(isCustomer,logoutController.logoutCustomer.bind(logoutController))


export default router
