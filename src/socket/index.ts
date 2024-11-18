import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { NotificationHandler } from './notificationHandler'
import { CheffHandler } from './cheffHandler'
import { CustomerHandler } from './customerHandler'
import { OrderHandler } from './orderHandler'

let cheffHandler: CheffHandler
let customerHandler: CustomerHandler

export function initSocket(server: HttpServer) {
  const io = new Server(3000, {
    cors: {
      origin: '*'
    }
  })


  cheffHandler = new CheffHandler(io)

  customerHandler = new CustomerHandler(io)


  console.log('Socket.IO server is running on port 3000')
  return io
}

export const cheffList = new Map();
