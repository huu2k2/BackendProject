import { NextFunction, Request, Response } from 'express'
import { AccountService } from './services'
import { HttpStatus } from '../../utils/HttpStatus'

const accountService = new AccountService()
export class AccountController {
  createAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await accountService.createAccount(req.body)
      return res.status(HttpStatus.CREATED.code).json({
        message: 'Account created successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  getAccounts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await accountService.getAccounts()
      return res.status(HttpStatus.OK.code).json({
        message: 'Get all account successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  getAccountById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { accountId } = req.params
      const result = await accountService.getAccountById(accountId)
      return res.status(HttpStatus.OK.code).json({
        message: 'Get account successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  updateAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { accountId } = req.params
      const result = await accountService.updateAccount(accountId, req.body)
      return res.status(HttpStatus.OK.code).json({
        message: 'Update account successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}

export const accountController = new AccountController()
