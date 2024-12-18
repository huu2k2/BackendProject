import { OrderDetailStatus, OrderStatus, PrismaClient } from '@prisma/client'
import { IOrder, IOrderDetail, IOrderMerge } from './interface'
import { NextFunction } from 'express'
import { ApiError } from '../../middleware/error.middleware'

const prisma = new PrismaClient()

export class OrderService {
  // Order Merge
  async createOrderMerge(dto: IOrderMerge, next: NextFunction): Promise<IOrderMerge | undefined> {
    try {
      const orderMerge = await prisma.orderMerge.create({
        data: {}
      })
      if (!orderMerge) {
        throw new ApiError(400, 'Failed to create order merge')
      }
      return orderMerge
    } catch (error) {
      throw error
    }
  }

  async getOrderMergeById(orderMergeId: string, next: NextFunction): Promise<IOrderMerge | undefined> {
    try {
      const orderMerge = await prisma.orderMerge.findUnique({
        where: { orderMergeId: orderMergeId },
        include: {
          order: true
        }
      })
      if (!orderMerge) {
        throw new ApiError(400, 'Failed to get order merge')
      }
      return orderMerge
    } catch (error) {
      throw error
    }
  }

  async getOrderMerges(next: NextFunction): Promise<Partial<IOrderMerge>[] | undefined> {
    try {
      const orderMerges = await prisma.orderMerge.findMany({
        include: {
          order: true
        }
      })
      if (!orderMerges) {
        throw new ApiError(400, 'Failed to get order merges')
      }
      return orderMerges
    } catch (error) {
      throw error
    }
  }

  // Order
  async createOrder(customerId: string, next: NextFunction): Promise<IOrder | undefined> {
    try {
      const newOrder = await prisma.order.create({
        data: {
          customerId: customerId,
          totalAmount: 0,
          status: 'FAILED'
        }
      })
      return newOrder
    } catch (error) {
      next(error)
    }
  }

  async getOrderById(orderId: string, next: NextFunction): Promise<IOrder | undefined> {
    try {
      const order = await prisma.order.findUnique({
        where: { orderId: orderId },
        include: {
          customer: true,
          orderDetails: true,
          payments: true,
          tableDetails: true,
          orderMerge: true
        }
      })
      if (!order) {
        throw new ApiError(400, 'Failed to get order')
      }
      return order
    } catch (error) {
      throw error
    }
  }

  async getOrders(next: NextFunction): Promise<Partial<IOrder>[] | undefined> {
    try {
      const orders = await prisma.order.findMany({
        include: {
          customer: true,
          orderDetails: true,
          payments: true,
          tableDetails: true,
          orderMerge: true
        }
      })
      if (!orders) {
        throw new ApiError(400, 'Failed to get orders')
      }
      return orders
    } catch (error) {
      throw error
    }
  }

  async updateOrder(orderId: string, dto: IOrder, next: NextFunction): Promise<IOrder | undefined> {
    try {
      const updateOrder = await prisma.order.update({
        where: { orderId: orderId },
        data: dto
      })
      console.log(updateOrder)
      if (!updateOrder) {
        throw new ApiError(400, 'Failed to update table')
      }
      return updateOrder
    } catch (error) {
      throw error
    }
  }

  // Order detail
  async createOrderDetail(dto: IOrderDetail[], next: NextFunction): Promise<IOrderDetail[] | undefined> {
    try {
      const newOrderDetail = await prisma.orderDetail.createMany({
        data: dto
      })
      const createdOrderDetails = await prisma.orderDetail.findMany({
        where: {
          OR: dto.map((item) => ({
            orderId: item.orderId,
            productId: item.productId,
            status: 'PENDING'
          }))
        }
      })
      return createdOrderDetails
    } catch (error) {
      next(error)
    }
  }

  async getOrderDetailById(orderDetailId: string, next: NextFunction): Promise<IOrderDetail | undefined> {
    try {
      const orderDetail = await prisma.orderDetail.findUnique({
        where: { orderDetailId: orderDetailId },
        include: {
          order: true,
          product: true
        }
      })
      if (!orderDetail) {
        throw new ApiError(400, 'Failed to get order detail')
      }
      return orderDetail
    } catch (error) {
      throw error
    }
  }

  async getOrderDetailByOrderId(orderId: string, next: NextFunction): Promise<IOrderDetail[] | undefined> {
    try {
      const orderDetails = await prisma.orderDetail.findMany({
        where: { orderId: orderId },
        include: {
          order: true,
          product: true
        }
      })
      if (!orderDetails) {
        throw new ApiError(400, 'Failed to get order details')
      }
      return orderDetails
    } catch (error) {
      throw error
    }
  }

  async updateOrderDetail(
    orderDetailId: string,
    dto: IOrderDetail,
    next: NextFunction
  ): Promise<IOrderDetail | undefined> {
    try {
      const updateOrderDetail = await prisma.orderDetail.update({
        where: { orderDetailId: orderDetailId },
        data: dto
      })
      if (!updateOrderDetail) {
        throw new ApiError(400, 'Failed to update order detail')
      }
      return updateOrderDetail
    } catch (error) {
      throw error
    }
  }

  async deleteOrderDetail(orderDetailId: string, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const orderDetail = await prisma.orderDetail.delete({
        where: { orderDetailId: orderDetailId }
      })
      if (!orderDetail) {
        throw new ApiError(400, 'Failed to delete table')
      }
      return true
    } catch (error) {
      throw error
    }
  }
}
