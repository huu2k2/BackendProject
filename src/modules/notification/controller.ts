import { NextFunction, Request, Response } from 'express'
import { notificationService } from './service'
import { INotification, GetNotficationInput } from './dto'
import jwt from 'jsonwebtoken'

export class NotificationController {
  async createNotification(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const rs = await notificationService.createNotification(req.body as INotification)
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

  async getAllNotification(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const authHeader = req!.headers!.authorization
      const token = authHeader!.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      req.user = decoded
      const result = await notificationService.getAllNotification(req.user.customerId)
      return res.status(200).json({
        message: 'get notification successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}

export const notificationController = new NotificationController()
