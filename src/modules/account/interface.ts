import { Profile, Role } from '@prisma/client'

export interface IAccount {
  accountId: string
  username: string
  password: string
  roleId: string | null
  isActive: boolean
}

export interface IAccountCreate {
  accountId: string
  username: string
  password: string
  role: Role
  roleId: string | null
  isActive: boolean
  profile: Profile
}
