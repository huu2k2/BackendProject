import { Notification, Prisma, PrismaClient } from '@prisma/client'
import { INotification } from './dto'
import { ApiError } from '../../middleware/error.middleware'
import { HttpStatus } from '../../utils/HttpStatus'

const prisma = new PrismaClient()

export class NotificationService {
  async createNotification(body: INotification | any): Promise<any> {
    if (!body.receiverId || !body.content) {
      throw new Error('receiverId và content là bắt buộc.')
    }

    const newNotification = await prisma.notification.create({
      data: body
    })

    if (!newNotification) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, "You don't create new notification!")
    }

    return {
      success: true,
      message: 'Thông báo đã được tạo thành công.',
      data: newNotification
    }
  }

  // async getAllNotificationById(body: INotification): Promise<Notification[]> {
  //   const notificationData = await prisma.notification
  //     .findMany
  //   {
  //   where: {
  //     receiverId: body.receiverId
  //   },
  //   orderBy: { createdAt: 'desc' }
  // }
  //     ()

  //   if (!notificationData) {
  //     return []
  //   }

  //   return notificationData || []
  // }

  async getAllNotification(customerId: string, staffId: string): Promise<Notification[]> {
    const result = await prisma.notification.findMany({
      where: {
        OR: [{ customerId: customerId }, { accountId: staffId }]
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!result) {
      return []
    }

    return result
  }

  async notifyToCustomer(orderId: string, content: string, title: string): Promise<any> {
    const order = await prisma.order.findFirst({
      where: {
        orderId: orderId
      },
      include: {
        customer: true
      }
    })

    const notification = await prisma.notification.create({
      data: {
        title: title,
        content: content,
        customerId: order?.customerId
      }
    })

    if (!notification) {
      return null
    }

    return notification
  }

  async notifyToStaff(content: string, title: string): Promise<any> {
    try {
      const role = await prisma.role.findFirst({
        where: {
          name: 'STAFF'
        }
      })

      const staffs = await prisma.account.findMany({
        where: { role }
      })

      staffs.forEach(async (staff) => {
        await prisma.notification.create({
          data: {
            title: title,
            content: content,
            accountId: staff?.accountId
          }
        })
      })

      return { title, content }
    } catch (error) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'error create notification')
    }
  }
}

export const notificationService = new NotificationService()
