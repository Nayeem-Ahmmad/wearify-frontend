import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { getProductImage, getProductPrice, formatPrice } from '../utils/productHelpers'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'

const ProductCard = ({ product, dark = false, badge }) => {
  const { authenticated } = useAuth()
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!authenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    const variantId = product.variants?.[0]?.id
    if (!variantId) {
      showToast('This product is not available right now')
      return
    }
    try {
      await addItem(variantId, 1)
      setAdded(true)
      showToast('Added to cart')
      setTimeout(() => setAdded(false), 1200)
    } catch {
      showToast('Could not add this item to cart')
    }
  }

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    if (!authenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    try {
      await toggleWishlist(product.id)
    } catch {
      showToast('Could not update wishlist')
    }
  }

  const image = getProductImage(product)
  const price = getProductPrice(product)
  const variant = product.variants?.[0]
  const currentPrice = Number(variant?.price ?? product.base_price)
  const originalPrice = Number(variant?.original_price ?? product.base_price)
  const hasDiscount = variant?.is_on_sale === true && originalPrice > currentPrice
  const discountPercent = hasDiscount
    ? Math.round((1 - currentPrice / originalPrice) * 100)
    : 0

  return (
    <Link
      to={`/products/${product.slug}`}
      className={`group relative block min-w-0 rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
    >
      {badge && (
        <span className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      <button
        type="button"
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform duration-300"
      >
        <FiHeart
          size={13}
          className={`transition-all duration-300 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-600'}`}
        />
      </button>

      <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-1">
        <img
          src={image}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-2">
        <p className={`text-xs font-medium truncate ${dark ? 'text-white' : 'text-slate-800'}`}>
          {product.name}
        </p>

        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <>
              <span className={`text-xs font-medium line-through decoration-1 decoration-orange-400 text-orange-500`}>
                {formatPrice(originalPrice)}
              </span>
              <span className="text-[9px] font-bold text-white bg-red-500 px-1 py-0.5 rounded-full">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-2 w-full flex items-center justify-center gap-1 text-[11px] font-bold py-1.5 rounded-full transition-all duration-300 ${added ? 'bg-green-500 text-white' : 'bg-orange-600 text-white hover:bg-green-700'}`}
        >
          <FiShoppingCart size={12} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}

export default ProductCard