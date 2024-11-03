import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { NotificationHandler } from './notificationHandler';

let notificationHandler: NotificationHandler;

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  notificationHandler = new NotificationHandler(io);

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle notifications
    notificationHandler.handleConnection(socket);

    socket.on('clientMessage', (msg) => {
      console.log('Message from client:', msg);
      socket.emit('serverMessage', 'Hello from server!');
    });
  });

  return io;
}

export { notificationHandler };