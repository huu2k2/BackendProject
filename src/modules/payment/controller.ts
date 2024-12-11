import e, { Request, Response, NextFunction } from 'express'
import { PaymentService } from './services'
import { HttpStatus } from '../../utils/HttpStatus'
import jwt from 'jsonwebtoken'

const paymentService = new PaymentService()

export class PaymentController {
  async createPayment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { orderId } = req.params
      const payment = await paymentService.createPayment(orderId, req.body, next)
      return res.status(HttpStatus.CREATED.code).json({
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
      return res.status(HttpStatus.OK.code).json({
        data: payment,
        message: 'Get payment success'
      })
    } catch (error) {
      next(error)
    }
  }

  async confirmPayment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const authHeader = req!.headers!.authorization
      const token = authHeader!.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      req.user = decoded
      const { paymentId, tableId } = req.params
      const data = req.body
      const payment = await paymentService.confirmPayment(
        {
          paymentId: paymentId,
          tableId: tableId,
          accountId: req.user.accountId,
          status: data.status
        },
        next
      )
      return res.status(HttpStatus.OK.code).json({
        data: payment,
        message: 'Confirm payment success'
      })
    } catch (error) {
      next(error)
    }
  }
}
