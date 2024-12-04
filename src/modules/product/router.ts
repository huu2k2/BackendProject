import { Router } from 'express'
import { ProductController } from './controller'
import { isManager } from '../../middleware/auth.middleware'

const router = Router()
const controller = new ProductController()

router.route('/').post(isManager, controller.createProduct).get(controller.getProducts)

router
  .route('/:productId')
  .get(controller.getProductById)
  .put(isManager, controller.updateProduct)
  .delete(isManager, controller.deleteProduct)

router.route('/category/:categoryId').get(controller.getProductByCategoryById.bind(controller))
router.route('/rand/products').get(controller.getRandProducts.bind(controller))

export default router
