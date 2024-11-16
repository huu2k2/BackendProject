import { Router } from 'express'
import { OrderController } from './controller'

const router = Router()
const controller = new OrderController()

router.route('/').post(controller.createOrder).get(controller.getOrders)

router.route('/detail').post(controller.createOrderDetail)

router.route('/merge').post(controller.createOrderMerge).get(controller.getOrderMerges)

router.route('/:orderId').get(controller.getOrderById).put(controller.updateOrder)

router.route('/:orderId/detail').get(controller.getOrderDetailByOrderId)

router
  .route('/detail/:orderDetailId')
  .post(controller.getOrderDetailById)
  .put(controller.updateOrderDetail)
  .delete(controller.deleteOrderDetail)

router.route('/merge/:orderMergeId').get(controller.getOrderMergeById)

export default router
