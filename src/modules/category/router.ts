import { Router } from 'express';
import { Controller } from './controller';
import { isAdmin } from '../../middleware/auth.middleware';
 
const router = Router();
const controller = new Controller();
 
router
  .route('/')
  .post(isAdmin, controller.create)
  .get(controller.getAll);

router
  .route('/:categoryId')
  .get(controller.getById)
  .put(isAdmin, controller.update)
  .delete(isAdmin, controller.delete);

export default router;