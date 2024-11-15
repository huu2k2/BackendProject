import { OrderDetailStatus, OrderStatus } from '@prisma/client'

export interface IOrderMerge {
  orderMergeId: string
  createdAt: Date
}

export interface IOrder {
  orderId: string
  customerId: string
  totalAmount: number
  status: OrderStatus
  orderMergeId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface IOrderDetail {
  orderDetailId: string
  orderId: string
  productId: string
  quantity: number
  status: OrderDetailStatus
  createdAt: Date
  updatedAt: Date
}
