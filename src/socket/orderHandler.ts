import { Namespace, Server, Socket } from 'socket.io'
import { CHEFF, CUSTOMER } from '../utils/namespase'

export class OrderHandler {
  private io: Namespace

  constructor(io: Server) {
    this.io = io.of(CHEFF)
    this.io.on('connection', (socket) => {
      console.log('Client connected to /cheff')
      console.log('socketId', socket.id)

      socket.emit('test', 'tao nè')

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
