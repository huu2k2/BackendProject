import e, { Request, Response, NextFunction } from 'express'
import { PaymentService } from './services'

const paymentService = new PaymentService()

export class PaymentController {
  async createPayment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { orderId } = req.params
      const payment = await paymentService.createPayment(orderId, req.body, next)
      return res.status(201).json({
        data: payment,
        message: 'Create payment success'
      })
    } catch (error) {
      next(error)
    }
  }

  async getPaymentByTableId(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { tableId } = req.params
      const payment = await paymentService.getPaymentByTableId(tableId, next)
      return res.status(200).json({
        data: payment,
        message: 'Get payment success'
      })
    } catch (error) {
      next(error)
    }
  }

  async confirmPayment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { paymentId, tableId } = req.params
      const payment = await paymentService.confirmPayment({ paymentId: paymentId, tableId: tableId }, next)
      return res.status(200).json({
        data: payment,
        message: 'Confirm payment success'
      })
    } catch (error) {
      next(error)
    }
  }
}
