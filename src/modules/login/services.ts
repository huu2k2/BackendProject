import { ERole } from '../../common/enum'
import { ApiError } from '../../middleware/error.middleware'
import { prisma } from '../../prismaClient'
import { HttpStatus } from '../../utils/HttpStatus'
import { generateTokenAndRefreshToken } from '../../utils/jwt'
import { CustomerLoginDto, CustomerLoginResponse, StaffLoginDto } from './dto'
import bcrypt from 'bcrypt'

export class LoginService {
  async loginCustomer(dto: CustomerLoginDto): Promise<CustomerLoginResponse | undefined> {
    const customer = await prisma.customer.findFirst({
      where: {
        name: dto.name,
        phoneNumber: dto.phoneNumber
      }
    })

    if (!customer) {
      throw new ApiError(HttpStatus.NOT_FOUND.code, 'Customer not found')
    }

    const addRoleToCustomer = {
      customerId: customer.customerId,
      createdAt: customer.createdAt,
      phoneNumber: customer.phoneNumber,
      name: customer.name,
      role: {
        name: ERole.CUSTOMER
      }
    }
    const { token, refreshToken } = generateTokenAndRefreshToken(addRoleToCustomer)
    return { token, refreshToken }
  }

  async loginStaff(dto: StaffLoginDto): Promise<any> {
    const staff = await prisma.account.findUnique({
      where: {
        username: dto.username
      },
      include: {
        role: {
          select: {
            name: true
          }
        },
        profile: true
      }
    })

    if (!staff) {
      throw new ApiError(HttpStatus.NOT_FOUND.code, 'Staff not found')
    }

    if (!staff.isActive) {
      throw new ApiError(HttpStatus.FORBIDDEN.code, 'Staff is block!')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, staff.password)

    if (!isPasswordValid) {
      throw new ApiError(HttpStatus.CONFLICT.code, 'Invalid password')
    }

    const { token, refreshToken } = generateTokenAndRefreshToken(staff)
    return { token, refreshToken }
  }

  async registerCustomer(dto: CustomerLoginDto): Promise<Boolean | undefined> {
    const isExistPhoneNumber = await prisma.customer.findFirst({
      where: {
        phoneNumber: dto.phoneNumber
      }
    })

    if (isExistPhoneNumber) {
      return true
    }

    const customer = await prisma.customer.create({
      data: {
        name: dto.name,
        phoneNumber: dto.phoneNumber
      }
    })

    if (!customer) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to create customer')
    }

    return true
  }
}

export const loginService = new LoginService()
