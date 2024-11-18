import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, CUSTOMER } from '../utils/namespase'

export class OrderHandler {
  private io: Namespace

  constructor(io: Server) {
    this.io = io.of(CHEFF)
    this.io.on('connection', (socket) => {
      socket.on('message', (msg) => {
        console.log(`Message from /admin: ${msg}`)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected from /cheff')
      })
    })
  }

  handleConnection() {}
}
