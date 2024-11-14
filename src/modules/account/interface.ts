export interface IAccount {
  username: string
  password: string
  role: {
    roleId: string
    name: string
  }
  profile: {
    firstName: string
    lastName: string
    address: string
    phoneNumber: string
    cccd: string
  }
}

export interface IUpdateAccount {
  username?: string
  password?: string
  roleId?: string
  isActive?: boolean
}

export interface IAccountResponse {
  accountId: string
  username: string
  roleId: string | null
  isActive: boolean
  createdAt: Date
}
