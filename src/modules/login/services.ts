import { NextFunction } from "express";
import { prisma } from "../../prismaClient";
import { generateTokenAndRefreshToken } from "../../utils/jwt";
import { CustomerLoginDto, CustomerLoginResponse, StaffLoginDto } from "./dto";
import bcrypt from 'bcrypt'
 


export class LoginService {
  async loginCustomer(dto: CustomerLoginDto, next: NextFunction): Promise<CustomerLoginResponse | undefined> {
    try {
      const customer = await prisma.customer.findFirst({
        where: {
          name: dto.name,
          phoneNumber: dto.phoneNumber
        }
      })
  
      if (!customer) {
        throw new Error('Customer not found')
      }
      
      const { token, refreshToken } = generateTokenAndRefreshToken(customer)
      return { token, refreshToken }
    } catch (error) {
      next(error)
    }
    
  }

  async loginStaff(dto: StaffLoginDto, next: NextFunction): Promise<CustomerLoginResponse | undefined> {
    try {
      const hashedPassword =  await bcrypt.hash(dto.password, 10);
      const staff = await prisma.account.findFirst({
        where: {
          username: dto.username,
          password: hashedPassword  
        }
      })

      if (!staff) {
        throw new Error('Staff not found')
      }

      const { token, refreshToken } = generateTokenAndRefreshToken(staff)
      return { token, refreshToken }
    } catch (error) {
      next(error)
    }
  }

  async registerCustomer(dto: CustomerLoginDto, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const isExistPhoneNumber = await prisma.customer.findFirst({
        where: {
          phoneNumber: dto.phoneNumber
        } 
      })

      if (isExistPhoneNumber) {
        throw new Error('Customer already exists')
      }
      
      const customer = await prisma.customer.create({
        data: {
          name: dto.name,
          phoneNumber: dto.phoneNumber
        }
      })
      if (!customer) {
        throw new Error('Failed to create customer')
      }
      return true
    } catch (error) {
      next(error)
    }
  }
}

export const loginService = new LoginService()
