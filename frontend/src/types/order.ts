export type Order = {
  id: string
  status: 'PLACED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  version: number
  createdAt: string
  user: { email: string }
  payment: { status: 'PENDING' | 'PAID' | 'FAILED' } | null
}