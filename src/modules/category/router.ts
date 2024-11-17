import { Router } from 'express';
import { Controller } from './controller';
 
const router = Router();
const controller = new Controller();
 
router
  .route('/')
  .post(controller.create)
  .get(controller.getAll);

router
  .route('/:categoryId')
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.delete);

export default router;