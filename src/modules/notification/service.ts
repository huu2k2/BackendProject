import { PrismaClient } from '@prisma/client'
import { CreateNotificationInput, GetNotficationInput, TypeGet } from './dto'
import { ApiError } from '../../middleware/error.middleware'
import { CHEFF } from '../../utils/namespase'
import { ERole } from '../../common/enum'

const prisma = new PrismaClient()

export class NotificationService {
  async createNotification(body: CreateNotificationInput): Promise<any> {
    const { type, content, status, receiverId, senderId } = body

    if (!receiverId || !content) {
      throw new Error('receiverId và content là bắt buộc.')
    }
    const newNotification = await prisma.notification.create({
      data: {
        type,
        content,
        status,
        receiverId,
        senderId
      }
    })

    return {
      success: true,
      message: 'Thông báo đã được tạo thành công.',
      data: newNotification
    }
  }

  async getAllNotificationById(body: GetNotficationInput) {
    if (!body.senderId || !body.type) {
      throw new Error('Thiếu senderId hoặc type trong đầu vào.')
    }

    let where
    if (body.type === TypeGet.RECEIVER) {
      where = {
        receiverId: body.senderId
      }
    } else {
      where = {
        senderId: body.senderId
      }
    }
    const notificationData = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    return notificationData || []
  }

  async notifyOfCheffWithCustomer(orderId: string, reason: string): Promise<any> {
    try {
      const role = await prisma.role.findFirst({
        where: {
          name: ERole.CHEFF
        }
      })
      const cheff = await prisma.account.findFirst({
        where: {
          role: role
        }
      })

      const order = await prisma.order.findFirst({
        where: {
          orderId: orderId
        },
        include: {
          customer: true
        }
      })

      const notification = prisma.notification.create({
        data: {
          content: reason,
          status: 'UNREAD',
          senderId: cheff?.accountId,
          receiverId: order?.customerId,
          type: 'CUSTOMER'
        }
      })

      return notification
    } catch (error) {
      throw new ApiError(400, 'error create notification')
    }
  }
}

export const notificationService = new NotificationService()
