import { OrderDetail, OrderDetailStatus, OrderStatus, Product, Table } from '@prisma/client'
import { TableDetail, TableDetailSocket } from '../table/interface'

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

export interface IOrderSocket {
  orderId: string
  customerId: string
  totalAmount: number
  status: OrderStatus
  orderMergeId?: string | null
  createdAt: Date
  updatedAt: Date
  tableDetails: TableDetailSocket[]
  orderDetails: OrderDetail[]
}

export interface IOrderDetail {
  price: number
  orderDetailId: string
  orderId: string
  productId: string
  quantity: number
  status: OrderDetailStatus
  createdAt: Date
  updatedAt: Date | null
}

export interface IGetOrderDetail {
  price: number
  orderDetailId: string
  orderId: string
  productId: string
  quantity: number
  status: OrderDetailStatus
  createdAt: Date | null
  updatedAt: Date | null
  product: Product
}

export interface SocketOrer {
  orders: IOrderSocket[]
}
