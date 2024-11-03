import { NextFunction, Request, Response } from 'express';
import { AccountService } from './services';
import { ApiResponse } from '../../utils/response.util';

export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  createAccount = async (req: Request, res: Response ,next: NextFunction): Promise<any> => {
       const result = await this.accountService.createAccount(req.body,next);
       return ApiResponse.created(res,result as string);
  };

   getAccounts = async (req: Request, res: Response ,next: NextFunction): Promise<any> => {
      const result = await this.accountService.getAccounts(next);
      return ApiResponse.success(res,result);
  };

   getAccountById = async (req: Request, res: Response ,next: NextFunction): Promise<any> => {
      const { id } = req.params;
      const result = await this.accountService.getAccountById(id,next);  
      return ApiResponse.success(res,result);
  };

   updateAccount = async (req: Request, res: Response , next: NextFunction): Promise<any> => {
      const { id } = req.params;
      const result = await this.accountService.updateAccount(id, req.body,next);
      return ApiResponse.created(res,result && 'Update account success');
  };

   deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { id } = req.params;
      const result = await this.accountService.deleteAccount(id ,next);
      return ApiResponse.created(res,result && 'Delete account success');
  };
}

export const accountController = new AccountController();