export enum RoleEnum {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export type User = {
  id: string
  email: string
  name: string
  role: RoleEnum
  createdAt: string
  updatedAt: string
}
export type UsersResponse = {
  data: User[]
  total: number
}
