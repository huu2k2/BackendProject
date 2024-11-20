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
      this.recieveNewOrder(socket)

      this.recieveOrderStatus(socket)

      this.receiveCancelOrderDetails(socket)

      this.receiveUpdateOrderDetails(socket)

      this.receiveNewOrderDetailFromCustomer(socket)

      socket.on('disconnect', () => {})
    })
  }

  async receiveCancelOrderDetails(customerSocket: Socket) {
    customerSocket.on('requestCanleOrderDetail', async (val: string[]) => {
      let result = await orderService.deleteOrderDetailSocket(val)
      customerSocket.emit('sendNotification', { mess: `remove successful ${result} datas`, val, status: true })
      this.io.of(CHEFF).emit('cancelOrderDetails', val)
    })
  }

  async receiveUpdateOrderDetails(socket: Socket) {
    socket.on('requestUpdateOrderDetail', async (val: OrderDetail[]) => {
      let result = await orderService.updateOrderDetailSocketCustomer(val)
      socket.emit('sendNotification', { mess: 'update successful', val, status: true })
      this.io.of(CHEFF).emit('updateOrderDetails', val)
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
          this.io.of(CHEFF).emit('newOrder', val)
        } else {
          console.log('No cheff clients connected')
        }
      } catch (error) {
        console.error('Error sending order to cheff:', error)
      }
    })
  }

  async receiveNewOrderDetailFromCustomer(socket: any) {
    socket.on('sendOrderDetail', async ({ data, orderId }: { data: OrderDetail[]; orderId: string }) => {
      console.log(data)
      this.io.of(CHEFF).emit('sendOrderDetailForCheff', data)
      this.io.of(CHEFF).emit('sendUpdateOrderQuantityForCheff', { orderId: orderId, quantity: data.length })
    })
  }
}
