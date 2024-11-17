import { NextFunction, Request, Response } from 'express'
import { loginService } from './services'

export class LoginController {
  async loginCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customerLoginResponse = await loginService.loginCustomer(req.body)
      return res.status(200).json({
        message: 'Customer logged in successfully',
        data: customerLoginResponse
      })
    } catch (error) {
      next(error)
    }
  }

  async loginStaff(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const staffLoginResponse = await loginService.loginStaff(req.body)
      return res.status(200).json({
        message: 'Staff logged in successfully',
        data: staffLoginResponse
      })
    } catch (error) {
      next(error)
    }
  }

  async registerCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const customerRegisterResponse = await loginService.registerCustomer(req.body)
      return res.status(200).json({
        message: 'Customer registered successfully',
        data: customerRegisterResponse
      })
    } catch (error) {
      next(error)
    }
  }
}

export const loginController = new LoginController()
