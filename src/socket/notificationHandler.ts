import { Server, Socket } from 'socket.io';

export class NotificationHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  handleConnection(socket: Socket) {
    // Join a room based on userId
    socket.on('joinRoom', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their notification room`);
    });

    // Listen for notification events
    socket.on('notification', (data: { 
      type: string;
      message: string;
      userId: string;
      timestamp: Date;
    }) => {
      console.log('Notification received:', data);
      
      // Emit to specific user's room
      this.io.to(`user-${data.userId}`).emit('newNotification', {
        type: data.type,
        message: data.message,
        timestamp: data.timestamp
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected from notification service');
    });
  }

  // Method to send notification from server
  sendNotification(userId: string, notification: {
    type: string;
    message: string;
    timestamp: Date;
  }) {
    this.io.to(`user-${userId}`).emit('newNotification', notification);
  }
}
 