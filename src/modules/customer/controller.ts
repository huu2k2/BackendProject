import { Request, Response, NextFunction } from 'express'
import { CustomerService } from './services'
import { HttpStatus } from '../../utils/HttpStatus'

const customerService = new CustomerService()

export class CustomerController {
  async createCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customer = await customerService.createCustomer(req.body)
      if ('message' in customer) {
        return res.status(HttpStatus.OK.code).json({
          message: customer.message,
          data: customer
        })
      }
      return res.status(HttpStatus.CREATED.code).json({ message: 'create successful', data: customer })
    } catch (error) {
      next(error)
    }
  }

  async getCustomers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customers = await customerService.getCustomers()
      return res.json({ message: 'get successful', data: customers })
    } catch (error) {
      next(error)
    }
  }

  async getCustomerById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customer = await customerService.getCustomersById(req.params.customerId)
      if (!customer) {
        return res.status(HttpStatus.NOT_FOUND.code).json({ message: 'Customer not found' })
      }
      return res.json({ message: 'get successful', data: customer })
    } catch (error) {
      next(error)
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customer = await customerService.updateCustomer(req.params.customerId, req.body)
      return res.json({ message: 'update successful', data: customer })
    } catch (error) {
      next(error)
    }
  }
}
