import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, CUSTOMER } from '../utils/namespase'
import { OrderService } from '../modules/order/services'

import { cheffList } from '.'
import { IGetOrderDetail } from '../modules/order/interface'
import { OrderDetail } from '@prisma/client'

const orderService = new OrderService()

export class CheffHandler {
  private io: Namespace

  constructor(io: Server) {
    this.io = io.of(CHEFF)
    this.io.on('connection', (socket) => {
      cheffList.set('cheff', socket)

      this.cancelOrdersFromCheff(socket)
      this.updateOrdersDetailFromCheff(socket)
      this.getAllOrdersFromCheff(socket)

      socket.on('disconnect', () => {})
    })
  }

  async cancelOrdersFromCheff(socket: any) {
    socket.on('cancelOrders', async ({ orderDetailIds, reason }: { orderDetailIds: string[]; reason: string }) => {
      console.log(reason, orderDetailIds)
      // get order detail to get table
      // emit to customer
    })
  }

  async updateOrdersDetailFromCheff(socket: any) {
    socket.on(
      'updateOrdersDetailFromCheff',
      async ({ orderDetailIds, updateType }: { orderDetailIds: string[]; updateType: number }) => {
        let mess = 'success'
        let result: any[] = []
        try {
          result = await orderService.updateOrderDetailSocket(orderDetailIds, updateType)
        } catch (error: any) {
          mess = error
        }
        socket.emit('getUpdateOrdersDetailFromCheff', { mess, result, updateType })
        // emit to customer
      }
    )
  }

  async getAllOrdersFromCheff(socket: any) {
    socket.on('getAllOrdersFromCheff', async (mess: string) => {
      const result = await orderService.getOrdersSocket()
      socket.emit('sendAllOrdersFromCheff', result.orders)
    })
  }
}
