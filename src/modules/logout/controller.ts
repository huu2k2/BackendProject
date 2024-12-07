import { NextFunction, Request, Response } from 'express'

import { HttpStatus } from '../../utils/HttpStatus'
import { logoutService } from './service'
import { LogoutCustomer } from './dto'


export class LogoutController {
  async logoutCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const result = await logoutService.logoutCustimerService(req.body as LogoutCustomer)
    } catch (error) {
      next(error)
    }
  }
}

export const logoutController = new LogoutController()
