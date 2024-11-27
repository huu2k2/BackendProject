import { IOrderSocket } from '../order/interface'

export interface IPayment {
  paymentId: string
  orderId: string
  method: string
  amount: number
}

export interface IPaymentSocket {
  paymentId: string
  orderId: string
  method: string
  amount: number
  order: IOrderSocket
}
