import { Namespace, Server, Socket } from 'socket.io'
import { STAFF } from '../utils/namespase'
import { customerList } from '.'
import { OrderService } from '../modules/order/services'
import { PaymentService } from '../modules/payment/services'
import { notificationService } from '../modules/notification/service'

const orderService = new OrderService()
const paymentService = new PaymentService()

export class StaffHandler {
  private io: Namespace
  private server: Server

  constructor(io: Server) {
    this.server = io
    this.io = io.of(STAFF)
    this.io.on('connection', (socket) => {
      console.log('Staff connected to socket')

      this.receiveConfirmPayment(socket)

      socket.on('disconnect', () => {})
    })
  }

  async receiveConfirmPayment(socket: any) {
    socket.on('confirmPayment', async (paymentId: string) => {
      const payment = await paymentService.getPaymentByIdSocket(paymentId)

      const socketCustomer = customerList.get(payment.orderId)

      const content = `Thanh toán thành công`
      const title = `Thanh toán thành công`
      const notification = await notificationService.notifyToCustomer(payment.orderId, content, title)
      if (notification) {
        this.server.to(socketCustomer.id).emit('confirmPaymentSuccess', notification)
      }
    })
  }
}
