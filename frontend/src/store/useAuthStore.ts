import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RoleEnum } from '../types/user'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: RoleEnum
}

export type AuthSession = {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

type AuthState = {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  setSession: (session: AuthSession) => void
  loginRequest: (email: string, password: string) => Promise<void>
  registerRequest: (dto: {
    name: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: (session) =>
        set({
          isAuthenticated: true,
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        }),
      loginRequest: async (email, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          throw new Error('Invalid email or password')
        }

        const session = (await response.json()) as AuthSession
        get().setSession(session)
      },
      registerRequest: async (dto) => {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        })

        if (!response.ok) {
          throw new Error('Failed to register user')
        }

        await get().loginRequest(dto.email, dto.password)
      },
      logout: async () => {
        const refreshToken = get().refreshToken

        if (refreshToken) {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          })
        }

        get().clearSession()
      },
      clearSession: () =>
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    { name: 'auth' },
  ),
)
