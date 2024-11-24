import { NotificationStatus, ReceiverType } from '@prisma/client'
export enum TypeGet {
  SENDER = 'SENDER',
  RECEIVER = 'RECEIVER'
}
export interface CreateNotificationInput {
  type: ReceiverType
  content: string
  status: NotificationStatus
  receiverId: string
  senderId: string
  orderId: string
  productId: string
}
export interface GetNotficationInput {
  type: TypeGet
  senderId: string
}
