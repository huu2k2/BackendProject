import { Router } from 'express'
import { PaymentController } from './controller'

const router = Router()
const controller = new PaymentController()

router.route('/:orderId/:tableId').post(controller.createPayment)

router.route('/:tableId').get(controller.getPaymentByTableId)

router.route('/:paymentId/:tableId/confirm').put(controller.confirmPayment)

export default router
