import { OrderStatus, Payment, PaymentStatus, PrismaClient, Table, TableStatus } from '@prisma/client'
import { NextFunction } from 'express'
import { IPayment } from './interface'
import { ApiError } from '../../middleware/error.middleware'

const prisma = new PrismaClient()

export class PaymentService {
  async createPayment(orderId: string, dto: IPayment, next: NextFunction): Promise<Payment | undefined> {
    try {
      const payment = await prisma.payment.create({
        data: {
          method: dto.method,
          createdAt: new Date(),
          amount: dto.amount,
          orderId: orderId,
          status: 'WAIT'
        }
      })
      if (!payment) {
        throw new ApiError(400, 'err create payment')
      }
      return payment
    } catch (error) {
      throw error
    }
  }

  async getPaymentByTableId(tableId: string, next: NextFunction): Promise<Payment | undefined> {
    try {
      console.log(tableId)
      const tableDetail = await prisma.tableDetail.findFirst({
        where: {
          tableId: tableId,
          endTime: null
        },
        include: {
          order: true
        }
      })

      const payment = await prisma.payment.findFirst({
        where: { orderId: tableDetail?.orderId }
      })

      if (!payment) {
        throw new ApiError(400, 'Failed to get payment')
      }

      return payment
    } catch (error) {
      throw error
    }
  }

  async confirmPayment(
    dataPayment: { paymentId: string; tableId: string },
    next: NextFunction
  ): Promise<Payment | undefined> {
    try {
      const payment = await prisma.payment.update({
        where: { paymentId: dataPayment.paymentId },
        data: {
          status: PaymentStatus.FINISH
        }
      })

      const order = await prisma.order.findUnique({
        where: { orderId: payment.orderId }
      })

      if (order) {
        if (order.orderMergeId) {
          const mergedOrders = await prisma.order.findMany({
            where: { orderMergeId: order.orderMergeId }
          })

          await prisma.order.updateMany({
            where: { orderMergeId: order.orderMergeId },
            data: { status: OrderStatus.SUCCESS }
          })

          for (const mergedOrder of mergedOrders) {
            const tableDetail = await prisma.tableDetail.findFirst({
              where: { orderId: mergedOrder.orderId }
            })

            await Promise.all([
              prisma.payment.updateMany({
                where: { orderId: mergedOrder.orderId },
                data: { status: PaymentStatus.FINISH }
              }),

              prisma.tableDetail.update({
                where: { tableDetailId: tableDetail!.tableDetailId },
                data: { endTime: new Date() }
              })
            ])

            if (tableDetail?.tableId) {
              await prisma.table.update({
                where: { tableId: tableDetail?.tableId },
                data: { status: TableStatus.AVAILABLE }
              })
            }
          }
        } else {
          await Promise.all([
            prisma.order.update({
              where: { orderId: order.orderId },
              data: { status: OrderStatus.SUCCESS }
            }),

            prisma.order.update({
              where: { orderId: payment.orderId },
              data: {
                status: OrderStatus.SUCCESS
              }
            })
          ])
        }
      }

      return payment
    } catch (error) {
      throw error
    }
  }
}
