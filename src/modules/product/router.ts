import { Router } from 'express'
import { ProductController } from './controller'

const router = Router()
const controller = new ProductController()

router.route('/').post(controller.createProduct).get(controller.getProducts)

router
  .route('/:productId')
  .get(controller.getProductById.bind(controller))
  .put(controller.updateProduct)
  .delete(controller.deleteProduct)

router.route('/category/:categoryId').get(controller.getProductByCategoryById.bind(controller))
router.route('/rand/products').get(controller.getRandProducts.bind(controller))

export default router
