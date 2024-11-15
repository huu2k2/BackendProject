import { Router } from 'express'
import { OrderController } from './controller'

const router = Router()
const controller = new OrderController()

router.route('/').post(controller.createTable).get(controller.getTables)

router.route('/:tableId').get(controller.getTableById).put(controller.updateTable).delete(controller.deleteOrderDetail)

router.route('/:tableId/detail').post(controller.createDetail)

export default router
