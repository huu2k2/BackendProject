import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF } from '../utils/namespase'
import { customerList } from '.'

export class CustomerHandler {
  private io: Server
  private cheffNamespace: Namespace

  constructor(io: Server) {
    this.io = io
    this.cheffNamespace = this.io.of(CHEFF)
    this.io.on('connection', (socket) => {
      console.log('Client connected to customer')

      socket.on('sendOrder', (val: string) => {
        customerList.set(val, socket)
        try {
          if (this.cheffNamespace.sockets.size > 0) {
            this.cheffNamespace.emit('newOrder', 'Có đơn mới')
          } else {
            console.log('No cheff clients connected')
          }
        } catch (error) {
          console.error('Error sending order to cheff:', error)
        }
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected from customer')
      })
    })
  }

  async recieveOrders() {
    this.io.on('sendOrder', (val: string) => {
      this.io.of(CHEFF).emit('newOrder', 'Có đơn mới')
    })
  }
}