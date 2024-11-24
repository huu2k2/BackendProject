import { Socket, Server } from 'socket.io'; // Import Server
import redis from '../config/redis.config';
import { actionSend, KeyNotification } from './types/notifications';
import { NotificationService } from '../modules/notification/service';
import { CreateNotificationInput } from '../modules/notification/dto';
import { NotificationStatus, ReceiverType } from '@prisma/client';

const notificationService = new NotificationService();

export class SendNotificationHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io; // Gán io vào class
  }

  async handlerSendNotificationFromCheff(socket: Socket) {
    this.registerEvent(socket, KeyNotification.CancelledDish);
    this.registerEvent(socket, KeyNotification.ConfirmedDish);
    this.registerEvent(socket, KeyNotification.SuccessDish);
  }

  async handlerRemoveOrderAfterPayment(socket: Socket){
    socket.on("payment", async (orderId: string ) => {
      await redis.del(orderId)
    });
  }

  private registerEvent(socket: Socket, event: KeyNotification) {
    socket.on(event, async (payload: NotificationPayload) => {
      await this.handleNotification(socket, event, payload);
    });
  }

  private async handleNotification(
    socket: Socket,
    event: KeyNotification,
    { nameDish, orderId, receiverId, senderId, productId }: NotificationPayload
  ) {
 
    try {
      const notification = actionSend.get(event);
      const socketId = await redis.get(orderId);

      this.io.to(socketId as string).emit('customer_notification', {
        data: nameDish,
        message: notification,
      });
      
      const payload: CreateNotificationInput = {
        type: ReceiverType.CUSTOMER,
        content: `${nameDish}`,
        status: NotificationStatus.UNREAD,
        receiverId,
        senderId,
        orderId,
        productId
      };
       await notificationService.createNotification(payload);
      
    } catch (error) {
      console.error('Error handling notification:', error);
      socket.emit('customer_notification', {
        data: 'An error occurred while processing the notification.',
      });
    }
  }
}

type NotificationPayload = {
  nameDish: string;
  orderId: string;
  receiverId: string;
  senderId: string;
  productId: string;
};
