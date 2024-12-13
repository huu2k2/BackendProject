import { IGetOrderDetail, IOrder, IOrderDetail, IOrderMerge } from './interface'
import { OrderDetail, OrderStatus, PrismaClient } from '@prisma/client'
import { ApiError } from '../../middleware/error.middleware'
import { HttpStatus } from '../../utils/HttpStatus'

const prisma = new PrismaClient()

export class OrderService {
  async getTurnover(fromDay: string, toDay: string): Promise<IOrder[]> {
    const fromDate = new Date(fromDay)
    const toDate = new Date(toDay)

    const orders = await prisma.order.findMany({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: fromDate,
          lte: toDate
        }
      },
      include: {
        orderDetails: {
          include: {
            product: true
          }
        }
      }
    })

    if (!orders) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to create order merge')
    }
    return orders
  }

  async createOrderMerge(dto: IOrderMerge): Promise<IOrderMerge | undefined> {
    const orderMerge = await prisma.orderMerge.create({
      data: {}
    })
    if (!orderMerge) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to create order merge')
    }
    return orderMerge
  }

  async getOrderMergeById(orderMergeId: string): Promise<IOrderMerge | undefined> {
    const orderMerge = await prisma.orderMerge.findUnique({
      where: { orderMergeId: orderMergeId },
      include: {
        order: true
      }
    })
    if (!orderMerge) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get order merge')
    }
    return orderMerge
  }

  async getOrderListByStatus(status: string): Promise<any> {
    const data = await prisma.order.findMany({
      where: { status: status as OrderStatus },
      include: {
        orderDetails: true,
        tableDetail: { include: { table: true } }
      }
    })
    if (!data) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get orders')
    }
    return data
  }

  async getOrderMerges(): Promise<Partial<IOrderMerge>[] | undefined> {
    const orderMerges = await prisma.orderMerge.findMany({
      include: {
        order: true
      }
    })
    if (!orderMerges) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get order merges')
    }
    return orderMerges
  }

  // Order
  async createOrder(customerId: string): Promise<IOrder | undefined> {
    const newOrder = await prisma.order.create({
      data: {
        customerId: customerId,
        totalAmount: 0,
        status: 'FAILED'
      }
    })
    return newOrder
  }

  async getOrderById(orderId: string): Promise<IOrder | undefined> {
    const order = await prisma.order.findUnique({
      where: { orderId: orderId },
      include: {
        customer: true,
        orderDetails: true,
        payment: true,
        tableDetail: true,
        orderMerge: true
      }
    })
    if (!order) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get order')
    }
    return order
  }

  async getOrders(): Promise<Partial<IOrder>[] | undefined> {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderDetails: true,
        payment: true,
        tableDetail: true,
        orderMerge: true
      },
      orderBy: { createdAt: 'desc' }
    })
    if (!orders) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get orders')
    }
    return orders
  }

  async updateOrder(orderId: string, dto: IOrder): Promise<IOrder | undefined> {
    const updateOrder = await prisma.order.update({
      where: { orderId: orderId },
      data: dto
    })
    if (!updateOrder) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to update table')
    }
    return updateOrder
  }

  async createOrderDetail(dto: IOrderDetail[]): Promise<IGetOrderDetail[] | undefined> {
    const createdOrderDetails = await Promise.all(dto.map((detail) => prisma.orderDetail.create({ data: detail })))

    const ids = createdOrderDetails.map((item) => item.orderDetailId)

    const orderDetails = await prisma.orderDetail.findMany({
      where: {
        orderDetailId: { in: ids }
      },
      include: {
        product: true
      }
    })

    return orderDetails
  }

  async getOrderDetailById(orderDetailId: string): Promise<IOrderDetail | undefined> {
    const orderDetail = await prisma.orderDetail.findUnique({
      where: { orderDetailId: orderDetailId },
      include: {
        order: true,
        product: true
      }
    })
    if (!orderDetail) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get order detail')
    }
    return orderDetail
  }

  async getOrderDetailByOrderId(orderId: string): Promise<IGetOrderDetail[] | undefined> {
    const orderDetails = await prisma.orderDetail.findMany({
      where: { orderId: orderId },
      include: {
        order: true,
        product: true
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!orderDetails) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get order details')
    }

    return orderDetails
  }

  async getOrderDetailByOrderIdOfMergeOrder(orderId: string): Promise<IGetOrderDetail[] | undefined> {
    let result: IGetOrderDetail[] = []
    const order = await prisma.order.findFirst({
      where: {
        orderId: orderId
      },
      include: {
        orderDetails: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      throw new ApiError(HttpStatus.NOT_FOUND.code, 'order not found')
    }

    order.orderDetails.forEach((item) => {
      if (item.status === 'COMPLETED') {
        result.push(item)
      }
    })

    if (order?.orderMergeId) {
      const orders = await prisma.order.findMany({
        where: {
          orderMergeId: order.orderMergeId,
          NOT: {
            orderId: order.orderId
          }
        },
        include: {
          orderDetails: {
            include: {
              product: true
            }
          }
        }
      })

      orders.forEach((order) => {
        order.orderDetails.forEach((item) => {
          if (item.status === 'COMPLETED') {
            result.push(item)
          }
        })
      })
    }
    return result
  }

  async getOrderDetailByOrderIdKitchen(orderId: string): Promise<IGetOrderDetail[] | undefined> {
    const orderDetails = await prisma.orderDetail.findMany({
      where: { orderId: orderId, OR: [{ status: 'PENDING' }, { status: 'CONFIRMED' }] },
      include: {
        order: true,
        product: true
      },
      orderBy: { createdAt: 'desc' }
    })
    if (!orderDetails) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get order details')
    }
    return orderDetails
  }

  async updateOrderDetail(orderDetailId: string, dto: IOrderDetail): Promise<IOrderDetail | undefined> {
    const updateOrderDetail = await prisma.orderDetail.update({
      where: { orderDetailId: orderDetailId },
      data: dto
    })
    if (!updateOrderDetail) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to update order detail')
    }
    return updateOrderDetail
  }

  async deleteOrderDetail(orderDetailId: string): Promise<Boolean | undefined> {
    const orderDetail = await prisma.orderDetail.delete({
      where: { orderDetailId: orderDetailId }
    })
    if (!orderDetail) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to delete table')
    }
    return true
  }

  async getAllOrderOfCustomer(customerId: string): Promise<any> {
    const orderDetail = await prisma.order.findMany({
      where: {
        customerId,
        status: 'SUCCESS'
      }
    })

    if (!orderDetail) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to delete table')
    }
    return orderDetail
  }

  async getOrdersSocket(): Promise<any> {
    try {
      const orders = await prisma.order.findMany({
        where: { status: OrderStatus.FAILED },
        include: {
          customer: true,
          orderDetails: true,
          payment: true,
          tableDetail: { include: { table: true } },
          orderMerge: true
        }
      })
      if (!orders) {
        throw new Error('Failed to get orders')
      }
      return orders
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getOrderDetailsByOrderIdSocket(id: string): Promise<OrderDetail[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await prisma.order.findFirst({
          where: { orderId: id },
          include: {
            orderDetails: {
              include: {
                product: true
              }
            }
          }
        })
        if (!order) {
          reject('Failed to get order')
        }
        resolve(order!.orderDetails)
      } catch (error) {
        reject(error)
      }
    })
  }

  async deleteOrderDetailSocket(data: string[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const count = prisma.orderDetail.deleteMany({
          where: {
            orderDetailId: { in: data }
          }
        })
        resolve(count)
      } catch (error) {
        reject(error)
      }
    })
  }

  async updateOrderDetailSocketCustomer(val: OrderDetail[]): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let removes: string[] = []
        let updates: { id: string; quantity: number }[] = []

        val.forEach((item) => {
          if (item.quantity == 0) {
            removes.push(item.orderDetailId)
          } else {
            updates.push({ id: item.orderDetailId, quantity: item.quantity })
          }
        })

        await prisma.$transaction(async (prisma) => {
          if (removes.length > 0) {
            await prisma.orderDetail.deleteMany({
              where: {
                orderDetailId: {
                  in: removes
                }
              }
            })
          }
          if (updates.length > 0) {
            for (const update of updates) {
              await prisma.orderDetail.update({
                where: {
                  orderDetailId: update.id
                },
                data: {
                  quantity: update.quantity
                }
              })
            }
          }
        })

        resolve('success')
      } catch (error) {
        reject(error)
      }
    })
  }

  async updateOrderDetailSocket(orderDetailIds: string[], updateType: number): Promise<IOrderDetail[]> {
    try {
      const status = updateType === 0 ? 'CANCELED' : updateType === 1 ? 'CONFIRMED' : 'COMPLETED'

      // Update the order details
      await prisma.orderDetail.updateMany({
        where: { orderDetailId: { in: orderDetailIds } },
        data: { status: status }
      })

      // Fetch the updated order details
      const updatedOrderDetails = await prisma.orderDetail.findMany({
        where: { orderDetailId: { in: orderDetailIds } }
      })

      return updatedOrderDetails
    } catch (error) {
      throw 'error update'
    }
  }

  async getOrderByIdSocket(orderId: string): Promise<any> {
    let order = await prisma.order.findFirst({
      where: { orderId: orderId },
      include: {
        customer: true,
        orderDetails: true,
        payment: true,
        tableDetail: {
          include: {
            table: true
          }
        },
        orderMerge: true
      }
    })
    if (!order) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get order')
    }
    return order
  }
}
