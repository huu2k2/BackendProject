import { Router } from 'express'
import { ProductController } from './controller'

const router = Router()
const controller = new ProductController()

router.route('/').post(controller.createProduct).get(controller.getProducts)
 
router
  .route('/:productId')
  .get(controller.getProductById)
  .put(controller.updateProduct)
  .delete(controller.deleteProduct)

export default router
