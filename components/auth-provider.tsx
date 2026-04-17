"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { registerUser } from "@/app/services/authService"
import { loginUser } from "@/app/services/authService"

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userFromBackend = await loginUser(email, password)

      const loggedUser: User = {
        id: userFromBackend.id,
        email: userFromBackend.email,
        name: userFromBackend.fullName,
      }

      setUser(loggedUser)
      localStorage.setItem("user", JSON.stringify(loggedUser))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      await registerUser(name, email, password)

      const newUser: User = {
        id: 0,
        email,
        name,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
      <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
