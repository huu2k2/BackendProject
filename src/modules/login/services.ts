import { prisma } from '../../prismaClient'
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
      throw new Error('Customer not found')
    }

    const { token, refreshToken } = generateTokenAndRefreshToken(customer)
    return { token, refreshToken }
  }

  async loginStaff(dto: StaffLoginDto): Promise<any> {
    // Tìm user dựa trên username
    const staff = await prisma.account.findUnique({
      where: {
        username: dto.username
      },
      include: {
        role: {
          select: {
            name: true
          }
        }
      }
    });
  
    if (!staff) {
      throw new Error('Staff not found');
    }
    if (!staff.isActive) {
      throw new Error('Staff is block!');
    }
    
    const isPasswordValid = await bcrypt.compare(dto.password, staff.password); 
  
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
  
    const { token, refreshToken } = generateTokenAndRefreshToken(staff);
    return { token, refreshToken };
  }
  

  async registerCustomer(dto: CustomerLoginDto): Promise<Boolean | undefined> {
 
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
 
  }
}

export const loginService = new LoginService()
