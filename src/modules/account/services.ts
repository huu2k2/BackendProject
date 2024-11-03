import { Account } from '@prisma/client';
import { ICreateAccount, IUpdateAccount } from './interface';
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import {prisma} from '../../prismaClient';
export class AccountService {
  async createAccount(data: ICreateAccount,next:NextFunction): Promise<string | undefined > {
    try {
      return await prisma.$transaction(async (tx) => {
        if (!data.password) {
          throw new Error('Password is required');
        }
        if (!data.username) {
          throw new Error('Username is required');
        }
        
        const hashedPassword = await bcrypt.hash(data.password, 10);
        if (!hashedPassword) {
          throw new Error('Failed to hash password');
        }

        const account = await tx.account.create({
          data: {
            username: data.username,
            password: hashedPassword,
            roleId: data.roleId,
          },
        });

        if (!account) {
          throw new Error('Failed to create account');
        }
 
        return "Account created successfully";
      });
    } catch (error) {
      next(error);
    }
  }

  async getAccounts(next:NextFunction): Promise<Partial<Account>[] | undefined> {
    try {
      const result = await prisma.account.findMany({
        include: {
          role: true,
          profile: true,
        },
      });
      if (!result) {
        throw new Error('No accounts found');
      }
      return result;
    } catch (error) {
      next(error);
    }
  }

  async getAccountById(accountId: string,next:NextFunction): Promise<Partial<Account>| undefined> {
    try {
      const result = await prisma.account.findUnique({
        where: { accountId },
        include: {
          role: true,
          profile: true,
        },
      });
      if (!result) {
        throw new Error('Account not found');
      }
      return result;
    } catch (error) {
      next(error);
    }
  }

  async updateAccount(accountId: string, data: IUpdateAccount,next:NextFunction): Promise<Boolean | undefined> {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const result = await prisma.account.update({
        where: { accountId },
        data,
      });
      if (!result) {
        throw new Error('Failed to update account');
      }
      return true;
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(accountId: string,next:NextFunction): Promise<Boolean | undefined> {
    try {
      const result = await prisma.account.delete({
        where: { accountId },
      });
      if (!result) {
        throw new Error('Failed to delete account');
      }
      return true;
    } catch (error) {
     next(error);
    }
  }
}

 