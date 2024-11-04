import { Account } from '@prisma/client';
import { ICreateAccount, IUpdateAccount } from './interface';
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import {prisma} from '../../prismaClient';
export class AccountService {
  async createAccount(data: ICreateAccount, next: NextFunction): Promise<string | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
          // Validate input
          if (!data.password || !data.username) {
            throw new Error('Username and password are required');
          }
  
          // Check if username exists
          const existingAccount = await tx.account.findUnique({
            where: { username: data.username }
          });
  
          if (existingAccount) {
            throw new Error('Username already exists');
          }
  
          // Hash password
          const hashedPassword = await bcrypt.hash(data.password, 10);
          if (!hashedPassword) {
            throw new Error('Failed to hash password');
          }
  
          // Create account and profile in transaction
          const account = await tx.account.create({
            data: {
              username: data.username,
              password: hashedPassword,
              roleId: data.roleId,
              profile: {
                create: {
                  firstName: data.profile.firstName,
                  lastName: data.profile.lastName,
                  address: data.profile.address,
                  phoneNumber: data.profile.phoneNumber,
                  cccd: data.profile.cccd
                }
              }
            },
            include: {
              profile: true
            }
          });
  
          if (!account || !account.profile) {
            throw new Error('Failed to create account or profile');
          }
  
          return "Account and profile created successfully";
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

 