import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, logoutUser, isAuthenticated } from '../api/auth'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [user, setUser] = useState(null)

  const refreshUser = useCallback(() => {
    if (!authenticated) {
      setUser(null)
      return
    }
    api.get('/shop/profile/')
      .then((res) => {
        const data = res.data.results || res.data
        const profile = data[0] || null
        setUser(profile ? { ...profile, username: profile.user?.username, email: profile.user?.email } : null)
      })
      .catch(() => setUser(null))
  }, [authenticated])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (username, password) => {
    await loginUser(username, password)
    setAuthenticated(true)
  }

  const logout = () => {
    logoutUser()
    setAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)