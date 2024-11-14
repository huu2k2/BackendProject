import { Account } from '@prisma/client'
import { ICreateAccount, IAccountResponse, IUpdateAccount } from './interface'
import bcrypt from 'bcrypt'
import { NextFunction } from 'express'
import { prisma } from '../../prismaClient'
import { ApiError } from '../../middleware/error.middleware'
export class AccountService {
  async createAccount(data: ICreateAccount, next: NextFunction): Promise<IAccountResponse | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        if (!data.password || !data.username) {
          throw new ApiError(400, 'Username and password are required')
        }

        const existingAccount = await tx.account.findUnique({
          where: { username: data.username }
        })

        if (existingAccount) {
          throw new ApiError(400, 'Username already exists')
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)
        if (!hashedPassword) {
          throw new ApiError(400, 'Failed to hash password')
        }

        const account = await tx.account.create({
          data: {
            username: data.username,
            password: hashedPassword,
            roleId: data.role.roleId,
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
        })

        if (!account || !account.profile) {
          throw new ApiError(400, 'Create profile fail')
        }

        return account
      })
    } catch (error) {
      next(error)
    }
  }

  async getAccounts(next: NextFunction): Promise<Partial<Account>[] | undefined> {
    try {
      const result = await prisma.account.findMany({
        include: {
          role: true,
          profile: true
        }
      })
      return result
    } catch (error) {
      next(error)
    }
  }

  async getAccountById(accountId: string, next: NextFunction): Promise<Partial<Account> | undefined> {
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
      next(error)
    }
  }

  async updateAccount(
    accountId: string,
    data: IUpdateAccount,
    next: NextFunction
  ): Promise<IAccountResponse | undefined> {
    try {
      const result = await prisma.account.update({
        where: { accountId },
        data: {
          isActive: data.isActive,
          roleId: data.role.roleId,
          profile: {
            update: {
              firstName: data.profile.firstName,
              lastName: data.profile.lastName,
              address: data.profile.address,
              cccd: data.profile.cccd,
              phoneNumber: data.profile.phoneNumber
            }
          }
        }
      })
      if (!result) {
        throw new ApiError(400, 'Fail')
      }
      return result
    } catch (error) {
      next(error)
    }
  }
}
