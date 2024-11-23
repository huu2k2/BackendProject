import { Socket } from 'socket.io'
import { customerList } from '.'
import { actionSend, KeyNotification } from './types/notifications'

export class SendNotificationHandler {
  async handelSendNotificationFromCheff(socket: Socket) {
    socket.on(KeyNotification.CancelledDish, ({ nameDish, orderId }: { nameDish: string; orderId: string[] }) => {
      const notification = actionSend.get(KeyNotification.CancelledDish)
      console.log("customerList" ,customerList ,orderId)
      
      if (notification) {
        console.log(`${nameDish} ${orderId}`, '=======================')
        // this.io.to(idReceiver).emit('customer_notification', {
        //   data: `${notification} ${nameDish}`
        // })
      } else {
        socket.emit('customer_notification', {
          data: 'No notification found for this action.'
        })
      }
    })
  }
}
