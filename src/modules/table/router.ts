import { Router } from 'express';
import { TableController } from './controller';
 

const router = Router();
const controller = new TableController();
 
router
  .route('/')
  .post(controller.createTable)
  .get(controller.getTables);

router
  .route('/:tableId')
  .get(controller.getTableById)
  .put(controller.updateTable)
  .delete(controller.deleteTable);

router
  .route('/:tableId/detail')
  .post(controller.createDetail)

export default router;