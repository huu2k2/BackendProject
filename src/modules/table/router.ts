import { Router } from 'express'
import { TableController } from './controller'
import { isStaff, isCustomer, isAdmin, isChef } from '../../middleware/auth.middleware'

const router = Router()
const controller = new TableController()

router.route('/').post(isAdmin, controller.createTable).get(isAdmin, isStaff, controller.getTables)

router.route('/area/:areaId').get(isAdmin, isStaff, controller.getTablesByAreaId)

router
  .route('/:tableId')
  .get(isStaff, isCustomer, isAdmin, controller.getTableById)
  .put(isAdmin, controller.updateTable)
  .delete(isAdmin, controller.deleteTable)

router.route('/merge/:tableId').get(isStaff, isCustomer, controller.getTableDetailToMergeByTableId)

router.route('/:tableId/detail').post(controller.createDetail)

router.route('/detail/:id/order').get(isStaff, isCustomer, isChef, controller.getOrderByTableDetailId)

router.route('/:tableId/merge').post(isStaff, controller.createMergeTable)

export default router
