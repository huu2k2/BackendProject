import e, { Request, Response, NextFunction } from 'express'
import { CustomerService } from './services'

const customerService = new CustomerService()

export class CustomerController {
  async createCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await customerService.createCustomer(req.body, next)
      return res.status(201).json(table)
    } catch (error) {
      next(error)
    }
  }

  async getCustomers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const tables = await customerService.getCustomers(next)
      return res.json(tables)
    } catch (error) {
      next(error)
    }
  }

  async getCustomerById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await customerService.getCustomersById(req.params.tableId, next)
      if (!table) {
        return res.status(404).json({ message: 'Table not found' })
      }
      return res.json(table)
    } catch (error) {
      next(error)
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await customerService.updateCustomer(req.params.tableId, req.body, next)
      return res.json(table)
    } catch (error) {
      next(error)
    }
  }
}
