import { Router } from 'express'
import { TableController } from './controller'

const router = Router()
const controller = new TableController()

router.route('/').post(controller.createTable).get(controller.getTables)

router.route('/area/:areaId').get(controller.getTablesByAreaId)

router.route('/:tableId').get(controller.getTableById).put(controller.updateTable).delete(controller.deleteTable)

router.route('/merge/:tableId').get(controller.getTableDetailToMergeByTableId)

router.route('/:tableId/detail').post(controller.createDetail)

router.route('/detail/:id/order').get(controller.getOrderByTableDetailId)

router.route('/:tableId/merge/:orderId').post(controller.createMergeTable)

export default router
