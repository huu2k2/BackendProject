import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, CUSTOMER } from '../utils/namespase'
import { OrderService } from '../modules/order/services'
import { cheffList } from '.'

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

      socket.on('disconnect', () => {})
    })
  }

  async getNewOrder(socket: any) {
    socket.on('getNewOrder', async (orderId: string) => {
      const result = await orderService.getOrderByIdSocket(orderId)
      socket.emit('showNewOrder', result)
    })
  }

  async cancelOrdersFromCheff(socket: any) {
    socket.on(
      'cancelOrders',
      async ({ orderId, orderDetailIds, reason }: { orderId: string; orderDetailIds: string[]; reason: string }) => {
        // console.log(reason, orderDetailIds)
        // get order detail to get table
        // emit to customer
      }
    )
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
        socket.emit('getUpdateOrdersQuantityFromCheff', { orderId, quantity: orderDetailIds.length, updateType })

        // emit to customer
        // FIX
        this.server.of('/').emit('updateOrderDetailStatusForCustomer', { orderId, orderDetailIds, updateType })
      }
    )
  }

  async getAllOrdersFromCheff(socket: any) {
    socket.on('getAllOrdersFromCheff', async (mess: string) => {
      const result = await orderService.getOrdersSocket()
      // console.log(result)
      socket.emit('sendAllOrdersFromCheff', result)
    })
  }
}
