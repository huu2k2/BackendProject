import { Router } from 'express'
import { TableController } from './controller'
import { isStaff, isCustomer, isManager, isChef, isManagerOrStaff } from '../../middleware/auth.middleware'

const router = Router()
const controller = new TableController()

router.route('/').post(isManager, controller.createTable).get(isManagerOrStaff, controller.getTables)

router.route('/area/:areaId').get(isManagerOrStaff, controller.getTablesByAreaId)

router
  .route('/:tableId')
  .get(isStaff || isCustomer || isManager, controller.getTableById)
  .put(isManager, controller.updateTable)
  .delete(isManager, controller.deleteTable)

router.route('/merge/:tableId').get(isStaff || isCustomer, controller.getTableDetailToMergeByTableId)

router.route('/:tableId/detail').post(controller.createDetail)

router.route('/detail/:id/order').get(isStaff || isCustomer || isChef, controller.getOrderByTableDetailId)

router.route('/:tableId/merge').post(isStaff, controller.createMergeTable)

export default router
