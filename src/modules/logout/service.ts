import { OrderStatus, TableStatus } from '@prisma/client'
import { ApiError } from '../../middleware/error.middleware'
import { prisma } from '../../prismaClient'
import { LogoutCustomer } from './dto'

export class LogoutService {
  async logoutCustimerService(body: LogoutCustomer): Promise<Boolean> {
    const { orderId, tableId } = body

    const order = await prisma.order.findUnique({
      where: {
        orderId
      }
    })

    if (!order) {
      throw new ApiError(404, "Not found table detail, order id and table id may be don't exist")
    }
    if (order.status === OrderStatus.FAILED) {
      return false
    }

    await prisma.table.update({
      where: {
        tableId
      },
      data: {
        status: TableStatus.AVAILABLE
      }
    })

    return true
  }
}

export const logoutService = new LogoutService()
