import { Router } from 'express'
import { loginController } from './controller'

const router = Router()

router
  .route('/')
  .post(loginController.createRole.bind(loginController))
  .get(loginController.getRoles.bind(loginController))
 

export default router
