import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { NotificationHandler } from './notificationHandler'
import { CheffHandler } from './cheffHandler'
import { CustomerHandler } from './customerHandler'

let cheffHandler: CheffHandler
let customerHandler: CustomerHandler

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  cheffHandler = new CheffHandler(io)

  customerHandler = new CustomerHandler(io)
}

export const cheffList = new Map()
