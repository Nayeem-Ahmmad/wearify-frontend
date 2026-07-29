import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, logoutUser, isAuthenticated } from '../api/auth'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (authenticated) {
      api.get('/shop/profile/')
        .then((res) => setUser(res.data[0] || null))
        .catch(() => setUser(null))
    } else {
      setUser(null)
    }
  }, [authenticated])

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
    <AuthContext.Provider value={{ authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)