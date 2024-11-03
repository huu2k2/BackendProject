export interface CustomerLoginDto {
  name: string
  phoneNumber: string
}

export interface CustomerRegisterDto {
  name: string
  phoneNumber: string
}

export interface CustomerLoginResponse {
  token: string
  refreshToken: string
}

export interface StaffLoginDto {
  username: string
  password: string
}


