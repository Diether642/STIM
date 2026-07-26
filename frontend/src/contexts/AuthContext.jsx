import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, logoutUser, getUser } from '../api/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getUser()
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const data = await loginUser(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    toast.success(`Welcome back, ${data.user.name}!`)
    return data.user
  }

  const register = async (formData) => {
    const data = await registerUser(formData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    toast.success('Account created successfully!')
    return data.user
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out.')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTourist: user?.role === 'tourist',
    isBusinessOwner: user?.role === 'business_owner',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}