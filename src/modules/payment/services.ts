import { Payment, PrismaClient, Table, TableStatus } from '@prisma/client'
import { NextFunction } from 'express'
import { ICreatePayment } from './interface'

const prisma = new PrismaClient()

export class PaymentService {
  async createPayment(orderId: string, dto: ICreatePayment, next: NextFunction): Promise<Payment | undefined> {
    try {
      const payment = await prisma.payment.create({
        data: {
          method: dto.method,
          createdAt: new Date(),
          amount: dto.total,
          orderId: orderId,
          status: 'WAIT'
        }
      })

      return payment
    } catch (error) {
      throw error
    }
  }

  async confirmPayment(paymentId: string, next: NextFunction): Promise<Payment | undefined> {
    try {
      const payment = await prisma.payment.update({
        where: { paymentId },
        data: {
          status: 'FINISH'
        }
      })
      return payment
    } catch (error) {
      throw error
    }
  }
}
