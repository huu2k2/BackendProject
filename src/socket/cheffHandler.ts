import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, CUSTOMER, STAFF } from '../utils/namespase'
import { OrderService } from '../modules/order/services'
import { cheffList, customerList } from '.'
import { prisma } from '../prismaClient'
import { notificationService } from '../modules/notification/service'

const orderService = new OrderService()

export class CheffHandler {
  private io: Namespace
  private server: Server

  constructor(io: Server) {
    this.server = io
    this.io = io.of(CHEFF)
    this.io.on('connection', (socket) => {
      cheffList.set('cheff', socket)

      this.getNewOrder(socket)

      this.cancelOrdersFromCheff(socket)

      this.updateOrdersDetailFromCheff(socket)

      this.getAllOrdersFromCheff(socket)

      this.receiveDishUp(socket)

      socket.on('disconnect', () => {})
    })
  }

  async getNewOrder(socket: any) {
    socket.on('getNewOrder', async (orderId: string) => {
      const result = await orderService.getOrderByIdSocket(orderId)
      socket.emit('showNewOrder', result)
    })
  }

  async receiveDishUp(socket: any) {
    socket.on('dishUp', async ({ orderId, quantity }: { orderId: string; quantity: number }) => {
      const order = await orderService.getOrderByIdSocket(orderId)
      const content = `${quantity} món ở bàn ${order.tableDetail.table.name} đã hoàn thành`,
        title = 'Thông báo món hoàn thành'
      const notification = await notificationService.notifyToStaff(content, title)
      this.server.of(STAFF).emit('sendToDishUp', notification)
    })
  }

  async cancelOrdersFromCheff(socket: any) {
    socket.on('cancelOrders', async ({ orderId, reason }: { orderId: string; reason: string }) => {
      const content = `Món ăn của bạn đã bị huỷ do: ${reason}`,
        title = 'Thông báo huỷ món'
      const notification = await notificationService.notifyToCustomer(orderId, content, title)
      const socketCustomer = customerList.get(orderId)

      this.server.to(socketCustomer.id).emit('receiveNotification', notification)
    })
  }

  async updateOrdersDetailFromCheff(socket: any) {
    socket.on(
      'updateOrdersDetailFromCheff',
      async ({
        orderId,
        orderDetailIds,
        updateType
      }: {
        orderId: string
        orderDetailIds: string[]
        updateType: number
      }) => {
        let mess = 'success'
        let result: any[] = []
        try {
          result = await orderService.updateOrderDetailSocket(orderDetailIds, updateType)
        } catch (error: any) {
          mess = error
        }
        socket.emit('getUpdateOrdersDetailFromCheff', { mess, result, updateType })
        const quantity = await orderService.getOrderQuantitySocket(orderDetailIds[0])
        socket.emit('getUpdateOrdersQuantityFromCheff', { orderId, quantity: quantity, updateType })

        const socketCustomer = customerList.get(orderId)
        this.server
          .to(socketCustomer.id)
          .emit('updateOrderDetailStatusForCustomer', { orderId, orderDetailIds, updateType })
      }
    )
  }

  async getAllOrdersFromCheff(socket: any) {
    socket.on('getAllOrdersFromCheff', async (mess: string) => {
      const result = await orderService.getOrdersSocket()
      socket.emit('sendAllOrdersFromCheff', result)
    })
  }
}
