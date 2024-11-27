import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, STAFF } from '../utils/namespase'
import { customerList } from '.'
import { OrderService } from '../modules/order/services'
import { OrderDetail } from '@prisma/client'
import { notificationService } from '../modules/notification/service'
import { table } from 'console'
import { PaymentService } from '../modules/payment/services'

const orderService = new OrderService()
const paymentService = new PaymentService()

export class CustomerHandler {
  private io: Server
  private cheffNamespace: Namespace

  constructor(io: Server) {
    this.io = io
    this.cheffNamespace = this.io.of(CHEFF)
    this.io.on('connection', (socket) => {
      this.againConnect(socket)

      this.recieveNewOrder(socket)

      this.recieveOrderStatus(socket)

      this.receiveCancelOrderDetails(socket)

      this.receiveUpdateOrderDetails(socket)

      this.receiveNewOrderDetailFromCustomer(socket)

      this.recieveSendMergeTableRequest(socket)

      this.recieveSendPaymentRequest(socket)

      socket.on('disconnect', () => {})
    })
  }

  async againConnect(customerSocket: Socket) {
    customerSocket.on('agianConnect', (val) => {
      if (val) {
        customerList.set(val, customerSocket)
        console.log('check customer', customerList.get(val).id)
      }
    })
  }

  async receiveCancelOrderDetails(customerSocket: Socket) {
    customerSocket.on(
      'requestCanleOrderDetail',
      async ({ orderDetails, orderId }: { orderDetails: string[]; orderId: string }) => {
        let result = await orderService.deleteOrderDetailSocket(orderDetails)
        customerSocket.emit('sendNotification', {
          mess: `remove successful ${result} datas`,
          val: orderDetails,
          status: true
        })
        this.io.of(CHEFF).emit('cancelOrderDetails', orderDetails)
        this.io.of(CHEFF).emit('updateCancelOrderDetailsQuantity', { orderId: orderId, quantity: orderDetails.length })
      }
    )
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
      this.io.of(CHEFF).emit('sendOrderDetailForCheff', data)
      this.io.of(CHEFF).emit('sendUpdateOrderQuantityForCheff', { orderId: orderId, quantity: data.length })
    })
  }

  async recieveSendPaymentRequest(socket: Socket) {
    socket.on('sendPaymentRequest', async (payment: any) => {
      console.log('sendPaymentRequest: ', payment.paymentId)
      // Get table name
      const tableName = await paymentService.getPaymentByIdSocket(payment.paymentId)
      const content = `Yêu cầu thanh toán ở bàn ${tableName}. Phương thức thanh toán ${payment.method}`,
        title = 'Yêu cầu thanh toán'
      const notification = await notificationService.notifyToStaff(content, title)
      console.log(notification)
      this.io.of(STAFF).emit('requestPayment', notification)
    })
  }
  async recieveSendMergeTableRequest(socket: Socket) {
    socket.on('sendMergeTableRequest', async (orderId: any) => {
      const order = await orderService.getOrderByIdSocket(orderId)
      let content = `Bàn ${order.tableDetail!.table.name} yêu cầu gộp bàn`,
        title = 'Yêu cầu gộp bàn'
      const notification = await notificationService.notifyToStaff(content, title)
      this.io.of(STAFF).emit('requestMergeTable', notification)
    })
  }
}
