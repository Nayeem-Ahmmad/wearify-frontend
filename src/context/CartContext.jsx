import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCart, addToCart, removeFromCart, updateCartItem } from '../api/cart'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { authenticated } = useAuth()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(() => {
    if (!authenticated) {
      setCart({ items: [], total: 0 })
      return
    }
    setLoading(true)
    getCart()
      .then((data) => setCart(data))
      .catch(() => setCart({ items: [], total: 0 }))
      .finally(() => setLoading(false))
  }, [authenticated])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addItem = async (variantId, quantity = 1) => {
    const data = await addToCart(variantId, quantity)
    setCart(data)
  }

  const removeItem = async (itemId) => {
    const data = await removeFromCart(itemId)
    setCart(data)
  }

  const updateItem = async (itemId, quantity) => {
    const data = await updateCartItem(itemId, quantity)
    setCart(data)
  }

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, addItem, removeItem, updateItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)