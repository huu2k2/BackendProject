import { PrismaClient } from '@prisma/client'
import { CreateNotificationInput, GetNotficationInput, TypeGet } from './dto'

const prisma = new PrismaClient()

export class NotificationService {
  async createNotification(body: CreateNotificationInput): Promise<any> {
    const { type, content, status, receiverId, senderId , orderId , productId} = body

    if (!receiverId || !content) {
      throw new Error('receiverId và content là bắt buộc.')
    }
    const newNotification = await prisma.notification.create({
      data: {
        type,
        content,
        status,
        receiverId,
        senderId,
        orderId,
        productId
      }
    })

    return {
      success: true,
      message: 'Thông báo đã được tạo thành công.',
      data: newNotification
    }
  }

  async getAllNotificationById(type: TypeGet, senderId: string) {
    if (!senderId || !type) {
      throw new Error('Thiếu senderId hoặc type trong đầu vào.');
    }
  
    
    const where = type === TypeGet.RECEIVER 
      ? { receiverId: senderId }
      : { senderId: senderId };
  

    const notificationData = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  

    const orderIds = notificationData
      .map((notification) => notification.orderId)
      .filter((id) => id !== null) as string[]; 
  
    const orders = await prisma.order.findMany({
      where: {
        orderId: { in: orderIds }, 
      },
    });
  
    const orderMap = new Map<string, unknown>();
    orders.forEach((order) => {
      orderMap.set(order.orderId, order);
    });
  
  
    const data = notificationData.map((notification) => ({
      ...notification,
      order: orderMap.get(notification.orderId as string) || null, 
    }));
  
    return data;
  }
  
}

export const notificationService = new NotificationService()
