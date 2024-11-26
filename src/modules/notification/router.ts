import { Router } from 'express'
import { notificationController } from './controller'

const router = Router()

router
  .route('/')
  .post(notificationController.createNotification.bind(notificationController))
  .get(notificationController.getAllNotification.bind(notificationController))

// router.route('/:id').get(notificationController.getAllNotification.bind(notificationController))

export default router
