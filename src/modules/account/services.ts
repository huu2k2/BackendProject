import { Account } from '@prisma/client'
import { IAccount, IAccountCreate } from './interface'
import bcrypt from 'bcrypt'
import { prisma } from '../../prismaClient'
import { ApiError } from '../../middleware/error.middleware'
import { HttpStatus } from '../../utils/HttpStatus'

export class AccountService {
  async createAccount(data: Omit<IAccountCreate, 'accountId'>): Promise<any> {
    if (!data.password || !data.username) {
      throw new ApiError(HttpStatus.NO_CONTENT.code, 'Username and password are required')
    }

    const existingAccount = await prisma.account.findUnique({
      where: { username: data.username }
    })

    if (existingAccount) {
      throw new ApiError(HttpStatus.CONFLICT.code, 'Username already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    if (!hashedPassword) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to hash password')
    }

    const account = await prisma.account.create({
      data: {
        username: data.username,
        password: hashedPassword,
        roleId: data.role.roleId,
        isActive: true
      },
      include: {
        profile: true,
        role: true
      }
    })

    await prisma.profile.create({
      data: {
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        address: data.profile.address,
        cccd: data.profile.cccd,
        phoneNumber: data.profile.phoneNumber,
        accountId: account.accountId
      }
    })

    if (!account) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Create profile fail')
    }

    return true
  }

  async getAccounts(): Promise<Account[] | any> {
    const result = await prisma.account.findMany({
      include: {
        role: true,
        profile: true
      },
      orderBy: { profile: { lastName: 'asc' } }
    })

    if (!result) {
      return []
    }

    return result
  }

  async getAccountById(accountId: string): Promise<Account | undefined> {
    const result = await prisma.account.findUnique({
      where: { accountId },
      include: {
        role: true,
        profile: true
      }
    })
    if (!result) {
      throw new ApiError(HttpStatus.NOT_FOUND.code, 'Account not found')
    }
    return result
  }

  async updateAccount(accountId: string, data: IAccountCreate): Promise<IAccount | undefined> {
    const result = await prisma.account.update({
      where: { accountId },
      data: {
        username: data.username,
        password: data.password,
        isActive: data.isActive,
        roleId: data.role.roleId
      }
    })

    await prisma.profile.update({
      where: { accountId },
      data: data.profile
    })

    if (!result) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Fail to update Account')
    }
    return result
  }
}
