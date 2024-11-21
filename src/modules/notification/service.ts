import { PrismaClient } from '@prisma/client'
import { CreateNotificationInput, GetNotficationInput, TypeGet } from './dto'

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

    let where;
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
}

export const notificationService = new NotificationService()
