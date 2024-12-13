import { Router } from 'express'
import { PaymentController } from './controller'
import { isStaff, isCustomer, isManager } from '../../middleware/auth.middleware'

const router = Router()
const controller = new PaymentController()

router.route('/order/:orderId').post(isCustomer, controller.createPayment)

router.route('/:tableId').get(isStaff || isCustomer, controller.getPaymentByTableId)

router.route('/:paymentId/:tableId/confirm').put(isStaff, controller.confirmPayment)

router.route('/order/:orderId/admin').post(isManager, controller.paymentByAdmin)

export default router
