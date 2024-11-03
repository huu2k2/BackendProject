export interface ICreateAccount {
  username: string;
  password: string;
  roleId?: string;
}

export interface IUpdateAccount {
  username?: string;
  password?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface IAccountResponse {
  accountId: string;
  username: string;
  roleId: string | null;
  isActive: boolean;
  createdAt: Date;
}