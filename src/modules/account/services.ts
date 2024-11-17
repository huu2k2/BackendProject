import { Account } from '@prisma/client'
import { IAccount } from './interface'
import bcrypt from 'bcrypt'
import { NextFunction } from 'express'
import { prisma } from '../../prismaClient'
import { ApiError } from '../../middleware/error.middleware'
export class AccountService {
  async createAccount(data: Omit<IAccount, "accountId">, next: NextFunction): Promise<any> {
    try {
      if (!data.password || !data.username) {
        throw new ApiError(400, 'Username and password are required')
      }

      const existingAccount = await prisma.account.findUnique({
        where: { username: data.username }
      })

      if (existingAccount) {
        throw new ApiError(400, 'Username already exists')
      }

      const hashedPassword = await bcrypt.hash(data.password, 10)
      if (!hashedPassword) {
        throw new ApiError(400, 'Failed to hash password')
      }

      const account = await prisma.account.create({
        data: {
          username: data.username,
          password: hashedPassword,
          roleId: data.roleId,
          isActive: true
        },
        include: {
          profile: true,
          role: true,
          notifications: true
        }
      })

      if (!account) {
        throw new ApiError(400, 'Create profile fail')
      }

      return true
    } catch (error) {
      throw error
    }
  }

  async getAccounts(next: NextFunction): Promise<Account[] | undefined> {
    try {
      const result = await prisma.account.findMany({
        include: {
          role: true,
          profile: true
        }
      })
      return result
    } catch (error) {
      throw error
    }
  }

  async getAccountById(accountId: string, next: NextFunction): Promise<Account | undefined> {
    try {
      const result = await prisma.account.findUnique({
        where: { accountId },
        include: {
          role: true,
          profile: true
        }
      })
      if (!result) {
        throw new ApiError(404, 'Account not found')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async updateAccount(accountId: string, data: IAccount, next: NextFunction): Promise<IAccount | undefined> {
    try {
      const result = await prisma.account.update({
        where: { accountId },
        data: {
          username: data.username,
          password: data.password,
          isActive: data.isActive,
          roleId: data.roleId
        }
      })
      if (!result) {
        throw new ApiError(400, 'Fail to update Account')
      }
      return result
    } catch (error) {
      throw error
    }
  }
}
