import e, { Request, Response, NextFunction } from 'express'
import { OrderService } from './services'
import { HttpStatus } from '../../utils/HttpStatus'

const orderService = new OrderService()

export class OrderController {
  async createOrderMerge(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderMerge = await orderService.createOrderMerge(req.body)
      return res.status(HttpStatus.CREATED.code).json({ message: 'create successful', data: orderMerge })
    } catch (error) {
      next(error)
    }
  }

  async getOrderMergeById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderMerge = await orderService.getOrderMergeById(req.params.orderMergeId)
      return res.status(HttpStatus.OK.code).json({ message: 'get successful', data: orderMerge })
    } catch (error) {
      next(error)
    }
  }

  async getOrderMerges(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderMerges = await orderService.getOrderMerges()
      return res.status(HttpStatus.OK.code).json({ message: 'get successful', data: orderMerges })
    } catch (error) {
      next(error)
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const order = await orderService.createOrder(req.body.customerId);
      return res.status(HttpStatus.CREATED.code).json({ message: 'creat successful', data: order })
    } catch (error) {
      next(error)
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const order = await orderService.getOrderById(req.params.orderId)
      return res.status(HttpStatus.OK.code).json({ message: 'get successful', data: order })
    } catch (error) {
      next(error)
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orders = await orderService.getOrders()
      return res.status(HttpStatus.OK.code).json({ message: 'get successful', data: orders })
    } catch (error) {
      next(error)
    }
  }

  async getAllOrderOfCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { customerID } = req.params
      const orders = await orderService.getAllOrderOfCustomer(customerID)
      return res.status(HttpStatus.OK.code).json({ message: 'get successful', data: orders })
    } catch (error) {
      next(error)
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const order = await orderService.updateOrder(req.params.orderId, req.body)
      return res.status(HttpStatus.OK.code).json({ message: 'update successful', data: order })
    } catch (error) {
      next(error)
    }
  }

  // Order detail
  async createOrderDetail(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.createOrderDetail(req.body)
      return res.status(HttpStatus.CREATED.code).json({
        message: 'Create successful orderDetails',
        data: orderDetail
      })
    } catch (error) {
      next(error)
    }
  }

  async getOrderDetailById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.getOrderDetailById(req.params.orderDetailId)
      if (!orderDetail) {
        return res.status(HttpStatus.NOT_FOUND.code).json({ message: 'order detail not found' })
      }
      return res.status(HttpStatus.OK.code).json({ message: 'get successful', data: orderDetail })
    } catch (error) {
      next(error)
    }
  }

  async getOrderDetailByOrderId(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.getOrderDetailByOrderId(req.params.orderId)
      if (!orderDetail) {
        return res.status(HttpStatus.NOT_FOUND.code).json({ message: 'order detail not found' })
      }
      return res.status(HttpStatus.OK.code).json({
        message: 'Get successful orderDetails',
        data: orderDetail
      })
    } catch (error) {
      next(error)
    }
  }

  async getOrderDetailByOrderIdOfMergeOrder(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.getOrderDetailByOrderIdOfMergeOrder(req.params.orderId)
      if (!orderDetail) {
        return res.status(HttpStatus.NOT_FOUND.code).json({ message: 'order detail not found' })
      }
      return res.status(HttpStatus.OK.code).json({
        message: 'Get successful orderDetails',
        data: orderDetail
      })
    } catch (error) {
      next(error)
    }
  }

  async getOrderDetailByOrderIdKitchen(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.getOrderDetailByOrderIdKitchen(req.params.orderId)
      if (!orderDetail) {
        return res.status(HttpStatus.NOT_FOUND.code).json({ message: 'order detail not found' })
      }
      return res.status(HttpStatus.OK.code).json({
        message: 'Get successful orderDetails',
        data: orderDetail
      })
    } catch (error) {
      next(error)
    }
  }

  async updateOrderDetail(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.updateOrderDetail(req.params.orderDetailId, req.body)
      return res.status(HttpStatus.OK.code).json({ message: 'update successful', data: orderDetail })
    } catch (error) {
      next(error)
    }
  }

  async deleteOrderDetail(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderDetail = await orderService.deleteOrderDetail(req.params.orderDetailId)
      return res.status(HttpStatus.OK.code).send()
    } catch (error) {
      next(error)
    }
  }

  async getTurnover(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const fromDay = req.query.fromDay as string | undefined
      const toDay = req.query.toDay as string | undefined

      if (!fromDay || !toDay) {
        return res.status(HttpStatus.NO_CONTENT.code).json({ message: 'fromDay and toDay are required' })
      }

      const data = await orderService.getTurnover(fromDay, toDay)
      return res.status(HttpStatus.OK.code).json({ message: 'update successful', data: data })
    } catch (error) {
      next(error)
    }
  }
}
