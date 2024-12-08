import { Router } from 'express'
import { notificationController } from './controller'

const router = Router()

router
  .route('/')
  .post(notificationController.createNotification.bind(notificationController))
  .get(notificationController.getAllNotificationForCustomer.bind(notificationController))

router.route('/staff').get(notificationController.getAllNotificationForStaff.bind(notificationController))

export default router
