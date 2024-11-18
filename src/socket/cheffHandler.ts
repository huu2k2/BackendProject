import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, CUSTOMER } from '../utils/namespase'
import { OrderService } from '../modules/order/services'
import { NextFunction } from 'express'
import { Service } from '../modules/category/services'
import { cheffList } from '.'

const orderService = new OrderService()
const categoryService = new Service()

export class CheffHandler {
  private io: Namespace

  constructor(io: Server) {
    this.io = io.of(CHEFF)
    this.io.on('connection', (socket) => {
      cheffList.set('cheff', socket)
      console.log('Client connected to /cheff')

      this.sendOrders(socket)

      this.io.on('newOrder', (mess: string) => {
        console.log(mess)
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
    this.io.on('newOrder', (mess: string) => {
      console.log(mess)
    })
  }
}
