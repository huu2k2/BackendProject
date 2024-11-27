import { Notification, PrismaClient } from '@prisma/client'
import { INotification } from './dto'
import { ApiError } from '../../middleware/error.middleware'

const prisma = new PrismaClient()

export class NotificationService {
  async createNotification(body: INotification): Promise<any> {
    const { title, content, receiverId } = body

    if (!receiverId || !content) {
      throw new Error('receiverId và content là bắt buộc.')
    }
    const newNotification = await prisma.notification.create({
      data: {
        title,
        content,
        receiverId
      }
    })

    return {
      success: true,
      message: 'Thông báo đã được tạo thành công.',
      data: newNotification
    }
  }

  async getAllNotificationById(body: INotification): Promise<Notification[]> {
    const notificationData = await prisma.notification.findMany({
      where: {
        receiverId: body.receiverId
      },
      orderBy: { createdAt: 'desc' }
    })
    return notificationData || []
  }

  async getAllNotification(id: string): Promise<Notification[]> {
    try {
      const ressult = await prisma.notification.findMany({
        where: {
          receiverId: id
        }
      })
      return ressult
    } catch (error) {
      throw error
    }
  }

  async notifyToCustomer(orderId: string, content: string, title: string): Promise<any> {
    try {
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
          receiverId: order?.customerId
        }
      })

      return notification
    } catch (error) {
      throw new ApiError(400, 'error create notification')
    }
  }

  async notifyToStaff(content: string, title: string): Promise<any> {
    try {
      const role = await prisma.role.findFirst({
        where: {
          name: 'STAFF'
        }
      })

      const staffs = await prisma.account.findMany({
        where: { role: role }
      })

      staffs.forEach(async (staff) => {
        await prisma.notification.create({
          data: {
            title: title,
            content: content,
            receiverId: staff?.accountId
          }
        })
      })

      const notification = { title, content }

      return notification
    } catch (error) {
      throw new ApiError(400, 'error create notification')
    }
  }
}

export const notificationService = new NotificationService()
