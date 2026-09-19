import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User } from 'firebase/auth'
import {
  logoutUser,
  subscribeToAuthChanges,
} from '../services/authService'

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextValue {
  user: User | null
  authLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  async function logout() {
    await logoutUser()
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }