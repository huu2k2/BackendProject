import { Router } from 'express'
import { notificationController } from './controller'

const router = Router()

router.route('/').post(notificationController.createNotification.bind(notificationController))

export default router
