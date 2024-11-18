import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, CUSTOMER } from '../utils/namespase'
import { OrderService } from '../modules/order/services'
import { Service } from '../modules/category/services'
import { cheffList } from '.'
import { resourceUsage } from 'process'

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
        console.log(mess)
        const result = await orderService.getOrdersSocket()
        console.log(result.orders[0].tableDetails)
        socket.emit('sendAllOrders', result.orders)
      })

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
