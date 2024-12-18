import e, { Request, Response, NextFunction } from 'express'
import { OrderService } from './services'

const orderService = new OrderService()

export class OrderController {
  async createOrderMerge(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderMerge = await orderService.createOrderMerge(req.body, next)
      return res.status(201).json({ message: 'create successful', data: orderMerge })
    } catch (error) {
      next(error)
    }
  }

  async getOrderMergeById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderMerge = await orderService.getOrderMergeById(req.params.orderMergeId, next)
      if (!orderMerge) {
        return res.status(404).json({ message: 'OrderMerge not found' })
      }
      return res.json({ message: 'get successful', data: orderMerge })
    } catch (error) {
      next(error)
    }
  }

  async getOrderMerges(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderMerges = await orderService.getOrderMerges(next)
      return res.json({ message: 'get successful', data: orderMerges })
    } catch (error) {
      next(error)
    }
  }

  // Order
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const order = await orderService.createOrder(req.body.customerId, next)
      return res.status(201).json({ message: 'creat successful', data: order })
    } catch (error) {
      next(error)
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const order = await orderService.getOrderById(req.params.orderId, next)
      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }
      return res.json({ message: 'get successful', data: order })
    } catch (error) {
      next(error)
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orders = await orderService.getOrders(next)
      return res.json({ message: 'get successful', data: orders })
    } catch (error) {
      next(error)
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // console.log(req.body)
      const order = await orderService.updateOrder(req.params.orderId, req.body, next)
      return res.json({ message: 'update successful', data: order })
    } catch (error) {
      next(error)
    }
  }

  // Order detail
  async createOrderDetail(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.createOrderDetail(req.body, next)
      return res.status(201).json({
        message: 'Create successful orderDetails',
        data: orderDetail
      })
    } catch (error) {
      next(error)
    }
  }

  async getOrderDetailById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.getOrderDetailById(req.params.orderDetailId, next)
      if (!orderDetail) {
        return res.status(404).json({ message: 'order detail not found' })
      }
      return res.json({ message: 'get successful', data: orderDetail })
    } catch (error) {
      next(error)
    }
  }

  async getOrderDetailByOrderId(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.getOrderDetailByOrderId(req.params.orderId, next)
      if (!orderDetail) {
        return res.status(404).json({ message: 'order detail not found' })
      }
      return res.json({
        message: 'Get successful orderDetails',
        data: orderDetail
      })
    } catch (error) {
      next(error)
    }
  }

  async updateOrderDetail(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.updateOrderDetail(req.params.orderDetailId, req.body, next)
      return res.json({ message: 'update successful', data: orderDetail })
    } catch (error) {
      next(error)
    }
  }

  async deleteOrderDetail(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.deleteOrderDetail(req.params.orderDetailId, next)
      return res.status(200).send()
    } catch (error) {
      next(error)
    }
  }
}
