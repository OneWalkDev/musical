'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  date_joined: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (username: string, password: string) => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // ページロード時に認証状態を確認
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser({ id: data.id, username: data.username, date_joined: '' })
      } else {
        setUser(null)
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      console.error('認証チェックエラー:', error)
      setUser(null)
      localStorage.removeItem('auth_token')
    } finally {
      setIsLoading(false)
    }
  }

  // バリデーションエラーを読みやすい形式に変換
  const formatErrorMessage = (data: any): string => {
    // 単一のerrorメッセージがある場合
    if (data.error) {
      return data.error
    }

    // フィールドエラー形式: {field: [errors]}
    if (typeof data === 'object') {
      const errors: string[] = []
      for (const [field, messages] of Object.entries(data)) {
        if (Array.isArray(messages)) {
          errors.push(...messages)
        } else if (typeof messages === 'string') {
          errors.push(messages)
        }
      }
      if (errors.length > 0) {
        return errors.join('、')
      }
    }

    return 'エラーが発生しました'
  }

  const login = async (username: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(formatErrorMessage(data))
    }

    const data = await response.json()
    localStorage.setItem('auth_token', data.token)
    setUser({ id: data.id, username: data.username, date_joined: '' })
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('ログアウトエラー:', error)
    } finally {
      localStorage.removeItem('auth_token')
      setUser(null)
      router.push('/')
    }
  }

  const signup = async (username: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(formatErrorMessage(data))
    }

    const data = await response.json()
    localStorage.setItem('auth_token', data.token)
    setUser({ id: data.id, username: data.username, date_joined: '' })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
