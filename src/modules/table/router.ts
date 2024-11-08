import { Router } from 'express';
import { TableController } from './controller';
 

const router = Router();
const controller = new TableController();
 

// Routes với middleware
router
  .route('/')
  .post(controller.createTable)
  .get(controller.getTables);

router
  .route('/:tableId')
  .get(controller.getTableById)
  .put(controller.updateTable)
  .delete(controller.deleteTable);

export default router;