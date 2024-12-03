import { NextFunction, Request, Response } from 'express'
import { AccountService } from './services'

const accountService = new AccountService()
export class AccountController {
  createAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await accountService.createAccount(req.body, next)
      return res.status(201).json({
        message: 'Account created successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  getAccounts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await accountService.getAccounts(next)
      return res.status(200).json({
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
      const result = await accountService.getAccountById(accountId, next)
      return res.status(200).json({
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
      const result = await accountService.updateAccount(accountId, req.body, next)
      return res.status(200).json({
        message: 'Update account successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}

export const accountController = new AccountController()
