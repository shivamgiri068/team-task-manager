'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { AuthUser } from '@/lib/auth'

type AuthContextType = {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: AuthUser | null
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
