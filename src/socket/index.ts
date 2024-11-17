import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { NotificationHandler } from './notificationHandler'
import { OrderHandler } from './orderHandler'

let notificationHandler: NotificationHandler
let orderHandler: OrderHandler

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  notificationHandler = new NotificationHandler(io)

  orderHandler = new OrderHandler(io)

  io.on('connection', (socket) => {
    console.log('A user connected')

    // Handle notifications
    notificationHandler.handleConnection(socket)

    socket.on('clientMessage', (msg) => {
      console.log('Message from client:', msg)
      socket.emit('serverMessage', 'Hello from server!')
    })
  })

  return io
}

export { notificationHandler }
