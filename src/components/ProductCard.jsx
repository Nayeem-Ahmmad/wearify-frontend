import { useState } from 'react'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'

const ProductCard = ({ product, dark = false, badge }) => {
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}
    >
      {product.discount && (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          -{product.discount}%
        </span>
      )}
      {badge && (
        <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}

      <button
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform duration-300"
      >
        <FiHeart
          size={16}
          className={`transition-all duration-300 ${wishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-600'}`}
        />
      </button>

      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-3">
        <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-slate-800'}`}>
          {product.name}
        </p>

        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            <FiStar size={12} className="fill-yellow-400 text-yellow-400" />
            <span className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              {product.rating} ({product.reviews})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1.5">
          <span className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            ${product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-slate-400 line-through">${product.oldPrice}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-full transition-all duration-300 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FiShoppingCart size={14} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard