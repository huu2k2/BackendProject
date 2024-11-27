import { Namespace, Server, Socket } from 'socket.io'
import { STAFF } from '../utils/namespase'
import { customerList } from '.'
import { OrderService } from '../modules/order/services'

const orderService = new OrderService()

export class StaffHandler {
  private io: Namespace
  private server: Server

  constructor(io: Server) {
    this.server = io
    this.io = io.of(STAFF)
    this.io.on('connection', (socket) => {
      console.log('Staff connected to socket')
      socket.on('disconnect', () => {})
    })
  }
}
