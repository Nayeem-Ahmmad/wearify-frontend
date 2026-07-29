import { useState } from 'react'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { getProductImage, getProductPrice, formatPrice } from '../utils/productHelpers'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'

const ProductCard = ({ product, dark = false, badge }) => {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
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
      showToast('Please login to add items to cart')
    }
  }

  const image = getProductImage(product)
  const price = getProductPrice(product)

  return (
    <a
      href={`/products/${product.slug}`}
      className={`group relative block min-w-0 rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`}
    >
      {badge && (
        <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}

      <button
        onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted) }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform duration-300"
      >
        <FiHeart
          size={16}
          className={`transition-all duration-300 ${wishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-600'}`}
        />
      </button>

      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-3">
        <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-slate-800'}`}>
          {product.name}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            {formatPrice(price)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-full transition-all duration-300 ${added ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          <FiShoppingCart size={14} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </a>
  )
}

export default ProductCard