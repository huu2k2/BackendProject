export interface ICreateAccount {
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
  role: {
    roleId: string
    name: string
  }
  isActive?: boolean
  profile: {
    firstName: string
    lastName: string
    address: string
    phoneNumber: string
    cccd: string
  }
}

export interface IAccountResponse {
  accountId: string
  username: string
  roleId: string | null
  isActive: boolean
  createdAt: Date
}
