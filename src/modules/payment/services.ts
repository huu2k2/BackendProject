import { Payment, PrismaClient, Table, TableStatus } from '@prisma/client'
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

      return payment
    } catch (error) {
      throw error
    }
  }

  async getPaymentByTableId(tableId: string, next: NextFunction): Promise<Payment | undefined> {
    try {
      const table = await prisma.table.findUnique({
        where: { tableId: tableId }, // Tìm theo tableId
        include: { tableDetails: true } // Gồm thông tin đơn hàng liên quan
      })

      const tableDetail = await prisma.tableDetail.findFirst({
        where: {
          tableId: tableId, // Điều kiện theo tableId
          endTime: null // Điều kiện endTime là null
        },
        include: {
          order: true // Gồm thông tin đơn hàng liên quan
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
          status: 'FINISH'
        }
      })

      const order = await prisma.order.findUnique({
        where: { orderId: payment.orderId }
      })

      if (order) {
        if (order.orderMergeId) {
          // Tìm các order có cùng mergeOrderId
          const mergedOrders = await prisma.order.findMany({
            where: { orderMergeId: order.orderMergeId }
          })

          // Cập nhật trạng thái của các order liên quan
          await prisma.order.updateMany({
            where: { orderMergeId: order.orderMergeId },
            data: { status: 'SUCCESS' }
          })

          // Từ order, tìm đến tableDetail và lấy table id (má nó dài ác)
          for (const mergedOrder of mergedOrders) {
            await prisma.payment.updateMany({
              where: { orderId: mergedOrder.orderId },
              data: { status: 'FINISH' }
            })
            const tableDetail = await prisma.tableDetail.findFirst({
              where: { orderId: mergedOrder.orderId }
            })
            if (tableDetail?.tableId) {
              await prisma.table.update({
                where: { tableId: tableDetail?.tableId },
                data: { status: 'AVAILABLE' }
              })
            }
          }

          // Cập nhật các payment khác
        } else {
          // Nếu orderMergeId là null, chỉ cập nhật order và table hiện tại
          await prisma.order.update({
            where: { orderId: order.orderId },
            data: { status: 'SUCCESS' }
          })

          await prisma.order.update({
            where: { orderId: payment.orderId },
            data: {
              status: 'SUCCESS'
            }
          })
        }
      }

      return payment
    } catch (error) {
      throw error
    }
  }
}
