import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export const WishlistProvider = ({ children }) => {
  const { authenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWishlist = useCallback(() => {
    if (!authenticated) {
      setItems([])
      return
    }
    setLoading(true)
    getWishlist()
      .then((data) => setItems(data.results || data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [authenticated])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const isWishlisted = (productId) => items.some((item) => item.product.id === productId)

  const getWishlistItemId = (productId) => {
    const found = items.find((item) => item.product.id === productId)
    return found ? found.id : null
  }

  const toggleWishlist = async (productId) => {
    const existingId = getWishlistItemId(productId)
    if (existingId) {
      await removeFromWishlist(existingId)
      setItems((prev) => prev.filter((item) => item.id !== existingId))
    } else {
      const created = await addToWishlist(productId)
      setItems((prev) => [...prev, created])
    }
  }

  return (
    <WishlistContext.Provider
      value={{ items, loading, isWishlisted, toggleWishlist, fetchWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)