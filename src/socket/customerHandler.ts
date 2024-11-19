import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF } from '../utils/namespase'
import { customerList } from '.'
import { OrderService } from '../modules/order/services'
import { OrderDetail } from '@prisma/client'

const orderService = new OrderService()

export class CustomerHandler {
  private io: Server
  private cheffNamespace: Namespace

  constructor(io: Server) {
    this.io = io
    this.cheffNamespace = this.io.of(CHEFF)
    this.io.on('connection', (socket) => {
      console.log('Client connected to customer: ')

      this.recieveNewOrder(socket)

      this.recieveOrderStatus(socket)

      this.receiveCancleOrderDetails(socket)

      this.receiveUpdateOrderDetails(socket)

      socket.on('disconnect', () => {
        console.log('Client disconnected from customer')
      })
    })
  }

  async receiveCancleOrderDetails(socket: Socket) {
    socket.on('requestCanleOrderDetail', async (val: string[]) => {
      let result = await orderService.deleteOrderDetailSocket(val)
      socket.emit('sendNotification', { mess: `remove successful ${result} datas`, val, status: true })
    })
  }

  async receiveUpdateOrderDetails(socket: Socket) {
    socket.on('requestUpdateOrderDetail', async (val: OrderDetail[]) => {
      let result = await orderService.updateOrderDetailSocketCustomer(val)
      socket.emit('sendNotification', { mess: 'update successful', val, status: true })
    })
  }

  async recieveOrderStatus(socket: Socket) {
    socket.on('requestGetOrderDetails', async (val: string) => {
      let results = await orderService.getOrderDetailsByOrderIdSocket(val)
      socket.emit('receiveOrderDetails', results)
    })
  }

  async recieveNewOrder(socket: Socket) {
    socket.on('sendOrder', (val: string) => {
      console.log(val)
      customerList.set(val, socket)
      try {
        if (this.cheffNamespace.sockets.size > 0) {
          this.io.of(CHEFF).emit('newOrder', 'Có đơn mới')
        } else {
          console.log('No cheff clients connected')
        }
      } catch (error) {
        console.error('Error sending order to cheff:', error)
      }
    })
  }
}
