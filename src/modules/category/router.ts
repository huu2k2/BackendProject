import { Router } from 'express'
import { CategoryController } from './controller'

const router = Router()
const controller = new CategoryController()

router.route('/').post(controller.createCategory).get(controller.getCategories)

router
  .route('/:categoryId')
  .get(controller.getCategoryById)
  .put(controller.updateCategory)
  .delete(controller.deleteCategory)

export default router
