import { PrismaClient, Table, TableStatus } from '@prisma/client'
import { ICustomer } from './interface'
import { NextFunction } from 'express'
import { ApiError } from '../../middleware/error.middleware'
import { generateTokenAndRefreshToken } from '../../utils/jwt'
import { CustomerLoginResponse } from '../login/dto'

const prisma = new PrismaClient()

export class CustomerService {
  async createCustomer(dto: ICustomer, next: NextFunction): Promise<CustomerLoginResponse> {
    try {
      // Kiểm tra xem tên bảng đã tồn tại trong cơ sở dữ liệu chưa
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          OR: [{ name: dto.name }, { phoneNumber: dto.phoneNumber }]
        }
      })

      // Nếu đã tồn tại bảng với tên này, ném lỗi
      if (existingCustomer) {
        // Chuyển sang đăng nhập
        const { token, refreshToken } = generateTokenAndRefreshToken(existingCustomer)
        return { token, refreshToken }
      }

      const newCustomer = await prisma.customer.create({
        data: {
          name: dto.name,
          phoneNumber: dto.phoneNumber
        }
      })

      if (!newCustomer) {
        throw new ApiError(400, 'Failed to create customer account')
      }

      const { token, refreshToken } = generateTokenAndRefreshToken(newCustomer)
      return { token, refreshToken }
    } catch (error) {
      throw error
    }
  }

  async getCustomers(next: NextFunction): Promise<Partial<ICustomer>[] | undefined> {
    try {
      const customers = await prisma.customer.findMany({
        include: {
          orders: true,
          notifications: true
        }
      })
      if (!customers) {
        throw new ApiError(400, 'Failed to get customers')
      }
      return customers
    } catch (error) {
      throw error
    }
  }

  async getCustomersById(customerId: string, next: NextFunction): Promise<ICustomer | undefined> {
    try {
      const customer = await prisma.customer.findUnique({
        where: { customerId },
        include: {
          orders: true,
          notifications: true
        }
      })
      if (!customer) {
        throw new ApiError(400, 'Failed to get customer')
      }
      return customer
    } catch (error) {
      throw error
    }
  }

  async updateCustomer(customerId: string, dto: ICustomer, next: NextFunction): Promise<ICustomer | undefined> {
    try {
      // Kiểm tra xem tên bảng đã tồn tại trong cơ sở dữ liệu chưa
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          OR: [{ name: dto.name }, { phoneNumber: dto.phoneNumber }],
          NOT: { customerId }
        }
      })

      // Nếu đã tồn tại bảng với tên này, ném lỗi
      if (existingCustomer) {
        throw new ApiError(400, 'Name or phoneNumber already exists')
      }

      const updateCustomer = await prisma.customer.update({
        where: { customerId },
        data: dto
      })
      if (!updateCustomer) {
        throw new ApiError(400, 'Failed to update customer')
      }
      return updateCustomer
    } catch (error) {
      throw error
    }
  }
}
