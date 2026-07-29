import { FiShoppingCart } from 'react-icons/fi'
import { formatPrice } from '../utils/productHelpers'

const StickyAddToCart = ({ visible, product, price, inStock, onAddToCart }) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
          <p className="text-sm font-bold text-blue-600">{formatPrice(price)}</p>
        </div>
        <button
          onClick={onAddToCart}
          disabled={!inStock}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 shrink-0"
        >
          <FiShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default StickyAddToCart