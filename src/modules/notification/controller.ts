import { NextFunction, Request, Response } from 'express'
import { notificationService } from './service'
import { CreateNotificationInput, GetNotficationInput } from './dto'


export class NotificationController {
  async createNotification(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
     const rs = await notificationService.createNotification(req.body as CreateNotificationInput)
    } catch (error) {
      next(error)
    }
  }
 
  async getAllNotificationById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
     const rs = await notificationService.getAllNotificationById(req.body as GetNotficationInput)
     return res.json(rs)
    } catch (error) {
      next(error)
    }
  }
}

export const notificationController = new NotificationController()
