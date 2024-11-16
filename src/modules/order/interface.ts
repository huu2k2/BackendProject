import { OrderDetailStatus, OrderStatus, Product } from '@prisma/client'

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
  price: number
  orderDetailId: string
  orderId: string
  productId: string
  quantity: number
  status: OrderDetailStatus
  createdAt?: Date
  updatedAt?: Date
  product: Product
}
