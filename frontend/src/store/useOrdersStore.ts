import { create } from 'zustand'
import { api } from '../api'
import type { Order } from '../types/order'
import { readError } from '../helpers/readError'
import { toOrder } from '../helpers/toOrder'

type OrdersState = {
  orders: Order[]
  error: string
  loading: boolean
  fetchOrders: () => Promise<void>
  updateStatus: (id: string, status: Order['status'], version: number) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  error: '',
  loading: false,
  fetchOrders: async () => {
    set({ loading: true, error: '' })
    try {
      const response = await api('/api/orders')
      if (!response.ok) throw new Error(await readError(response))
      const orders = ((await response.json()) as Array<Order & { totalAmount: string | number }>).map(toOrder)
      set({ orders, loading: false })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Request failed' })
    }
  },
  updateStatus: async (id, status, version) => {
    const response = await api(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, version }),
    })
    if (!response.ok) throw new Error(await readError(response))
    const order = toOrder((await response.json()) as Order & { totalAmount: string | number })
    set((state) => ({
      orders: state.orders.map((item) => (item.id === id ? order : item)),
    }))
  },
  remove: async (id) => {
    const response = await api(`/api/orders/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(await readError(response))
    set((state) => ({ orders: state.orders.filter((item) => item.id !== id) }))
  },
}))
