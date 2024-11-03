import { NextFunction, Request, Response } from 'express'
import { loginService } from './services'

export class LoginController {
  async loginCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    const customerLoginResponse = await loginService.loginCustomer(req.body, next)
    return res.status(200).json({
      message: 'Customer logged in successfully',
      data: customerLoginResponse
    })
  }

  async loginStaff(req: Request, res: Response, next: NextFunction): Promise<any> {
    const staffLoginResponse = await loginService.loginStaff(req.body, next)
    return res.status(200).json({
      message: 'Staff logged in successfully',
      data: staffLoginResponse
    })
  }

  async registerCustomer(req: Request, res: Response, next: NextFunction): Promise<any> {
    const customerRegisterResponse = await loginService.registerCustomer(req.body, next)
    return res.status(200).json({
      message: 'Customer registered successfully',
      data: customerRegisterResponse
    })
  }

}


export const loginController = new LoginController()
