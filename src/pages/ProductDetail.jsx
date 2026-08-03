import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FiHeart, FiShoppingCart, FiChevronRight, FiCheck, FiZoomIn, FiX,
  FiTruck, FiRefreshCw, FiShield, FiChevronDown,
} from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ReviewsSection from '../components/ReviewsSection'
import StickyAddToCart from '../components/StickyAddToCart'
import RecentlyViewed, { addToRecentlyViewed } from '../components/RecentlyViewed'
import { useToast } from '../components/Toast'
import { getProduct, getRelatedProducts } from '../api/products'
import { getReviews } from '../api/reviews'
import { getProductImages, formatPrice } from '../utils/productHelpers'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const trustBadges = [
  { icon: FiShield, label: 'Secure Payment' },
  { icon: FiRefreshCw, label: '7 Days Return', comingSoon: true },
  { icon: FiCheck, label: 'Original Product' },
  { icon: FiTruck, label: 'Fast Delivery' },
]

const deliveryInfo = [
  { title: 'Delivery Time', desc: 'Usually delivered within 3-5 business days inside Dhaka, 5-7 days outside Dhaka.' },
  { title: 'Free Shipping', desc: 'Free shipping on all orders over ৳2000.' },
  { title: 'Cash on Delivery', desc: 'Cash on Delivery is available across Bangladesh.' },
]

const ProductDetail = () => {
  const { slug } = useParams()
  const { showToast } = useToast()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviewCount, setReviewCount] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isZooming, setIsZooming] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [openAccordion, setOpenAccordion] = useState(0)
  const [showSticky, setShowSticky] = useState(false)
  const [flyAnim, setFlyAnim] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const cartBtnRef = useRef(null)
  const { authenticated } = useAuth()
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getProduct(slug)
      .then((data) => {
        setProduct(data)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
        addToRecentlyViewed(data)
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))

    getRelatedProducts(slug)
      .then((data) => setRelated(data))
      .catch(() => setRelated([]))
  }, [slug])

  useEffect(() => {
    if (!product) return
    getReviews(product.id).then((data) => {
      const list = data.results || data
      setReviewCount(list.length)
      setAvgRating(list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0)
    }).catch(() => { })
  }, [product])

  useEffect(() => {
    const onScroll = () => {
      if (!cartBtnRef.current) return
      const rect = cartBtnRef.current.getBoundingClientRect()
      setShowSticky(rect.bottom < 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    try {
      await addItem(selectedVariant.id, quantity)
      setAdded(true)
      setFlyAnim(true)
      showToast('Added to cart successfully')
      setTimeout(() => setAdded(false), 1500)
      setTimeout(() => setFlyAnim(false), 700)
    } catch {
      showToast('Please login to add items to cart')
    }
  }

  const handleBuyNow = async () => {
    if (!authenticated) {
      navigate('/login')
      return
    }
    if (!selectedVariant) return
    setBuyNowLoading(true)
    try {
      const data = await addItem(selectedVariant.id, quantity)
      const cartItem = data.items.find((i) => i.variant.id === selectedVariant.id)
      navigate('/checkout', { state: cartItem ? { buyNowItemIds: [cartItem.id] } : undefined })
    } catch {
      showToast('Please login to buy this product')
    } finally {
      setBuyNowLoading(false)
    }
  }

  const handleWishlistToggle = async () => {
    try {
      await toggleWishlist(product.id)
    } catch {
      showToast('Please login to use wishlist')
    }
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-2xl max-w-md" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="text-slate-500">Product not found.</p>
          <a href="/shop" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Back to Shop
          </a>
        </div>
        <Footer />
      </div>
    )
  }

  const images = getProductImages(product)
  const currentPrice = Number(selectedVariant?.price ?? product.base_price)
  const originalPrice = Number(selectedVariant?.original_price ?? product.base_price)
  const price = currentPrice
  const hasDiscount = selectedVariant?.is_on_sale === true && originalPrice > currentPrice
  const discountPercent = hasDiscount
    ? Math.round((1 - currentPrice / originalPrice) * 100)
    : 0
  const stock = selectedVariant ? selectedVariant.stock_quantity : null
  const inStock = stock === null || stock > 0

  const sizes = product.variants
    ? [...new Set(product.variants.map((v) => v.size).filter(Boolean))]
    : []
  const colors = product.variants
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : []

  return (
    <div className="min-h-screen bg-white pb-4">
      <TopBar />
      <Navbar />

      <button
        onClick={handleWishlistToggle}
        className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center hover:scale-125 transition-all duration-300"
      >
        <FiHeart size={20} className={isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
      </button>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <a href="/" className="hover:text-blue-600 transition-colors duration-300">Home</a>
          <FiChevronRight size={12} />
          <a href="/shop" className="hover:text-blue-600 transition-colors duration-300">Shop</a>
          <FiChevronRight size={12} />
          <span className="text-slate-600">{product.name}</span>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="max-w-md mx-auto md:mx-0 w-full">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onClick={() => setFullscreen(true)}
            >
              <img
                key={selectedImage}
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300 animate-fade-in"
                style={
                  isZooming
                    ? { transform: 'scale(2)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : {}
                }
              />
              {!isZooming && (
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-slate-500">
                  <FiZoomIn size={14} />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-300 ${i === selectedImage ? 'border-blue-600' : 'border-transparent hover:border-slate-300'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {product.brand && (
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  {product.brand.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-medium text-slate-700">{avgRating.toFixed(1)}</span>
              </div>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-slate-500 hover:text-blue-600 transition-colors duration-300"
              >
                {reviewCount} reviews
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-2xl font-bold text-blue-600">{formatPrice(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-base font-medium text-orange-500 line-through decoration-2 decoration-orange-400">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {stock !== null && (
              <div className="flex items-center gap-2 mb-5 text-sm">
                {stock > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-stock-pulse" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    {stock <= 10 && <span className="text-orange-500">— Only {stock} left</span>}
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            )}

            <p className="text-sm text-slate-600 leading-relaxed mb-6">{product.description}</p>

            {sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-slate-800 mb-2.5">Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        const match = product.variants.find(
                          (v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color)
                        )
                        setSelectedVariant(match || product.variants.find((v) => v.size === size))
                      }}
                      className={`min-w-[44px] h-11 px-3 rounded-lg border text-sm font-medium transition-all duration-300 hover:scale-105 ${selectedVariant?.size === size
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-800 mb-2.5">Color</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const match = product.variants.find(
                          (v) => v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size)
                        )
                        setSelectedVariant(match || product.variants.find((v) => v.color === color))
                      }}
                      className={`px-4 h-11 rounded-lg border text-sm font-medium transition-all duration-300 hover:scale-105 ${selectedVariant?.color === color
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-800 mb-2.5">Quantity</p>
              <div className="flex items-center border border-slate-200 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-90 transition-all duration-150"
                >
                  −
                </button>
                <span key={quantity} className="w-10 text-center text-sm font-medium animate-fade-in">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-90 transition-all duration-150"
                >
                  +
                </button>
              </div>
            </div>

            <div ref={cartBtnRef} className="flex items-center gap-3 relative">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-medium transition-all duration-300 overflow-hidden ${added
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95'
                  } disabled:opacity-50 disabled:hover:scale-100`}
              >
                {added ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
                {added ? 'Added to Cart' : 'Add to Cart'}
                {flyAnim && (
                  <span
                    className="absolute left-1/2 top-1/2 w-3 h-3 bg-white rounded-full animate-fly-to-cart"
                    style={{ '--fly-x': '300px', '--fly-y': '-200px' }}
                  />
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock || buyNowLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95 transition-all duration-300 disabled:opacity-50"
              >
                {buyNowLoading && (
                  <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
                {buyNowLoading ? 'Processing...' : 'Buy Now'}
              </button>

              <button
                onClick={handleWishlistToggle}
                className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center hover:border-red-300 transition-all duration-300 shrink-0"
              >
                <FiHeart
                  size={20}
                  className={`transition-all duration-300 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-400'}`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {trustBadges.map(({ icon: Icon, label, comingSoon }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-600">
                  <Icon size={15} className="text-blue-600 shrink-0" />
                  <span>{label}</span>
                  {comingSoon && (
                    <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Soon</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {deliveryInfo.map((item, i) => (
                <div key={item.title}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {item.title}
                    <FiChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${openAccordion === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openAccordion === i ? 'max-h-24' : 'max-h-0'
                      }`}
                  >
                    <p className="px-4 pb-3 text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-b border-slate-100">
          <div className="flex gap-8">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm font-medium capitalize transition-colors duration-300 ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tab === 'reviews' ? `Reviews (${reviewCount})` : tab}
                {activeTab === tab && (
                  <span className="absolute left-0 -bottom-px h-0.5 w-full bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8 animate-fade-in" key={activeTab}>
          {activeTab === 'description' ? (
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{product.description}</p>
          ) : (
            <ReviewsSection productId={product.id} />
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-bold text-slate-900 mb-5">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <RecentlyViewed excludeSlug={product.slug} />
      </section>

      <Footer />

      <StickyAddToCart
        visible={showSticky}
        product={product}
        price={price}
        inStock={inStock}
        onAddToCart={handleAddToCart}
      />

      {fullscreen && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setFullscreen(false)}
        >
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
          >
            <FiX size={20} />
          </button>
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="max-w-full max-h-full object-contain animate-scale-in"
          />
        </div>
      )}
    </div>
  )
}

export default ProductDetail