import { Router } from 'express'
import { OrderController } from './controller'
import { isAdmin, isStaff, isCustomer, isChef } from '../../middleware/auth.middleware'

const router = Router()
const controller = new OrderController()

router.route('/').post(isCustomer, controller.createOrder).get(isChef, controller.getOrders)

router.route('/detail').post(isCustomer, controller.createOrderDetail)

router.route('/merge').post(isStaff, controller.createOrderMerge).get(controller.getOrderMerges)

router.route('/:orderId').get(isChef, controller.getOrderById).put(isCustomer, controller.updateOrder)

router.route('/:orderId/detail').get(isStaff || isCustomer || isChef, controller.getOrderDetailByOrderId)

router.route('/:orderId/detail/kitchen').get(isChef, controller.getOrderDetailByOrderIdKitchen)

router.route('/:orderId/detail/payment').get(isStaff || isCustomer, controller.getOrderDetailByOrderIdOfMergeOrder)

router
  .route('/detail/:orderDetailId')
  .post(isStaff || isCustomer || isChef, controller.getOrderDetailById)
  .put(isCustomer || isChef, controller.updateOrderDetail)
  .delete(isCustomer, controller.deleteOrderDetail)

router.route('/merge/:orderMergeId').get(isStaff || isCustomer, controller.getOrderMergeById)

export default router
