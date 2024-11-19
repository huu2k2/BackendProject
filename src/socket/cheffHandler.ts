import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, CUSTOMER } from '../utils/namespase'
import { OrderService } from '../modules/order/services'
import { Service } from '../modules/category/services'
import { cheffList } from '.'
import { IGetOrderDetail } from '../modules/order/interface'

const orderService = new OrderService()
const categoryService = new Service()

export class CheffHandler {
  private io: Namespace

  constructor(io: Server) {
    this.io = io.of(CHEFF)
    this.io.on('connection', (socket) => {
      cheffList.set('cheff', socket)

      this.sendOrders(socket)

      this.getNewOrder(socket)

      socket.on('newOrder', (mess: string) => {
        console.log(mess)
      })

      socket.on('getAllOrders', async (mess: string) => {
        const result = await orderService.getOrdersSocket()
        socket.emit('sendAllOrders', result.orders)
      })

      socket.on('cancelOrders', async ({ orderDetailIds, reason }: { orderDetailIds: string[]; reason: string }) => {
        console.log(reason, orderDetailIds)
        // get order detail to get table
        // emit to customer
      })

      socket.on(
        'updateOrdersDetail',
        async ({ orderDetailIds, updateType }: { orderDetailIds: string[]; updateType: number }) => {
          let mess = 'success'
          let result: any[] = []
          try {
            result = await orderService.updateOrderDetailSocket(orderDetailIds, updateType)
          } catch (error: any) {
            mess = error
          }
          socket.emit('getUpdateOrdersDetail', { mess, result, updateType })
          // emit to customer
        }
      )

      socket.on('disconnect', () => {
        console.log('Client disconnected from /cheff')
      })
    })
  }

  async sendOrders(socket: any) {
    let result = await categoryService.getAllSocket()
    socket.emit('sendOrders', result)
  }

  async receiveNewOrder(socket: any) {
    socket.on('newOrder', (mess: string) => {
      console.log(mess)
    })
  }

  async getNewOrder(socket: any) {
    socket.on('getNewOrder', (mess: string) => {
      console.log(mess)
    })
  }
}
