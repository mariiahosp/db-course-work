import { create } from 'zustand'
import { api } from '../api'
import type { User, UsersResponse } from '../types/user'

type UsersState = {
  users: User[]
  error: string
  loading: boolean
  selectedUser: User | null
  fetchUsers: () => Promise<void>
  fetchUser: (id: string) => Promise<void>
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  error: '',
  loading: false,
  selectedUser: null,
  fetchUsers: async () => {
    set({ loading: true, error: '' })

    try {
      const response = await api('/api/users')

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const body = (await response.json()) as UsersResponse
      set({ users: body.data, loading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed'
      set({ error: message, loading: false })
    }
  },
  fetchUser: async (id) => {
    set({ loading: true, error: '' })

    try {
      const response = await api(`/api/users/${id}`)

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const body = (await response.json()) as User
      set({ selectedUser: body, loading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed'
      set({ error: message, loading: false })
    }
  }
}))
