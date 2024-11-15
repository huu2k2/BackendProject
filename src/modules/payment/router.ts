import { Router } from 'express'
import { PaymentController } from './controller'

const router = Router()
const controller = new PaymentController()

router.route('/:orderId').post(controller.createPayment)

router.route('/:orderId/confirm').put(controller.createPayment)

export default router
