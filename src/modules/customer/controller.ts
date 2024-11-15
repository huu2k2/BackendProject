import e, { Request, Response, NextFunction } from 'express'
import { CustomerService } from './services'

const customerService = new CustomerService()

export class CustomerController {
  async createCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customer = await customerService.createCustomer(req.body, next)
      console.log(req.body)
      return res.status(201).json(customer)
    } catch (error) {
      next(error)
    }
  }

  async getCustomers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customers = await customerService.getCustomers(next)
      return res.json(customers)
    } catch (error) {
      next(error)
    }
  }

  async getCustomerById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customer = await customerService.getCustomersById(req.params.customerId, next)
      if (!customer) {
        return res.status(404).json({ message: 'Table not found' })
      }
      return res.json(customer)
    } catch (error) {
      next(error)
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customer = await customerService.updateCustomer(req.params.customerId, req.body, next)
      return res.json(customer)
    } catch (error) {
      next(error)
    }
  }
}
