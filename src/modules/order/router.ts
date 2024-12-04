import { Router } from 'express'
import { OrderController } from './controller'
import {
  isManager,
  isStaff,
  isCustomer,
  isChef,
  isChefOrCustomerOrStaff,
  isStaffOrCustomer
} from '../../middleware/auth.middleware'

const router = Router()
const controller = new OrderController()

router.route('/').post(isCustomer, controller.createOrder).get(isChef, controller.getOrders)

router.route('/customer/:customerId').get(isCustomer, controller.getAllOrderOfCustomer)

router.route('/detail').post(isCustomer, controller.createOrderDetail)

router.route('/turnover').get(controller.getTurnover)

router.route('/merge').post(isStaff, controller.createOrderMerge).get(controller.getOrderMerges)

router.route('/:orderId').get(isChef, controller.getOrderById).put(isCustomer, controller.updateOrder)

router.route('/:orderId/detail').get(isChefOrCustomerOrStaff, controller.getOrderDetailByOrderId)

router.route('/:orderId/detail/kitchen').get(isChef, controller.getOrderDetailByOrderIdKitchen)

router.route('/:orderId/detail/payment').get(isStaffOrCustomer, controller.getOrderDetailByOrderIdOfMergeOrder)

router
  .route('/detail/:orderDetailId')
  .post(isStaff || isCustomer || isChef, controller.getOrderDetailById)
  .put(isCustomer || isChef, controller.updateOrderDetail)
  .delete(isCustomer, controller.deleteOrderDetail)

router.route('/merge/:orderMergeId').get(isStaff || isCustomer, controller.getOrderMergeById)

export default router
