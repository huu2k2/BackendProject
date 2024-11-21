import { Router } from 'express'
import { ProductController } from './controller'
import { isAdmin } from '../../middleware/auth.middleware'

const router = Router()
const controller = new ProductController()

router.route('/').post(controller.createProduct).get(controller.getProducts)
 
router
  .route('/:productId')
  .get(controller.getProductById)
  .put(isAdmin, controller.updateProduct)
  .delete(isAdmin, controller.deleteProduct)

router.route('/category/:categoryId').get(controller.getProductByCategoryById.bind(controller))
router.route('/rand/products').get(controller.getRandProducts.bind(controller))

export default router
