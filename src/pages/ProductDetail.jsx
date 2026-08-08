import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { FaStar, FaRegStar } from 'react-icons/fa'
import {
  FiHeart, FiShare2, FiShoppingCart, FiChevronRight, FiCheck, FiZoomIn, FiX,
  FiTruck, FiRefreshCw, FiShield, FiCreditCard, FiPackage, FiBell, FiCheckCircle, FiMaximize2,
} from 'react-icons/fi'

import { subscribeStockNotification } from '../api/stockNotifications'
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
import { getProductImages, getProductImagesWithColor, formatPrice } from '../utils/productHelpers'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL']

const truncateWords = (text, wordLimit = 25) => {
  if (!text) return ''
  const words = text.split(' ')
  if (words.length <= wordLimit) return text
  return words.slice(0, wordLimit).join(' ') + '...'
}

const deliveryInfo = [
  { icon: FiTruck, title: 'Delivery Time', desc: 'Usually delivered within 3-5 business days inside Dhaka, 5-7 days outside Dhaka.' },
  { icon: FiCreditCard, title: 'Shipping Charge', desc: '৳60 inside Dhaka, ৳130 outside Dhaka — free over ৳2,500.' },
  { icon: FiPackage, title: 'Cash on Delivery', desc: 'Cash on Delivery is available across Bangladesh.' },
]

const returnInfo = [
  { icon: FiShield, title: 'Secure Payment', desc: 'COD & SSLCommerz (bKash, Nagad, cards)' },
  { icon: FiRefreshCw, title: '7 Days Return', desc: 'Coming soon', comingSoon: true },
  { icon: FiCheck, title: 'Original Product', desc: '100% authentic, quality checked' },
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
  const [showSticky, setShowSticky] = useState(false)
  const [flyAnim, setFlyAnim] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [notifyVariant, setNotifyVariant] = useState(null)
  const [notifyLoading, setNotifyLoading] = useState(false)
  const [subscribedVariantIds, setSubscribedVariantIds] = useState(new Set())
  const [showSizeGuide, setShowSizeGuide] = useState(false)
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

  const redirectToLogin = () => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)

  const handleAddToCart = async () => {
    if (!authenticated) {
      redirectToLogin()
      return
    }
    if (!selectedVariant) return
    try {
      await addItem(selectedVariant.id, quantity)
      setAdded(true)
      setFlyAnim(true)
      showToast('Added to cart successfully')
      setTimeout(() => setAdded(false), 1500)
      setTimeout(() => setFlyAnim(false), 700)
    } catch {
      showToast('Could not add this item to cart')
    }
  }

  const handleBuyNow = async () => {
    if (!authenticated) {
      redirectToLogin()
      return
    }
    if (!selectedVariant) return
    setBuyNowLoading(true)
    try {
      const data = await addItem(selectedVariant.id, quantity)
      const cartItem = data.items.find((i) => i.variant.id === selectedVariant.id)
      navigate('/checkout', { state: cartItem ? { buyNowItemIds: [cartItem.id] } : undefined })
    } catch {
      showToast('Could not process this order')
    } finally {
      setBuyNowLoading(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!authenticated) {
      redirectToLogin()
      return
    }
    try {
      await toggleWishlist(product.id)
    } catch {
      showToast('Could not update wishlist')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url })
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      await navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard')
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
        <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-[420px_1fr_300px] gap-8 animate-pulse">
          <div className="aspect-[4/5] bg-slate-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl" />
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
  const imagesWithColor = getProductImagesWithColor(product)
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
      .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
    : []
  const colors = product.variants
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : []

  // A size counts as available only if the *currently selected color* has a
  // variant for it with stock — otherwise it's shown greyed out, Daraz-style,
  // instead of being hidden entirely.
  const isSizeAvailable = (size) => {
    if (!selectedVariant?.color) return true
    return product.variants.some(
      (v) => v.color === selectedVariant.color && v.size === size && v.stock_quantity > 0
    )
  }

  const colorSwatchImage = (color) => {
    const found = imagesWithColor.find((img) => img.color === color)
    return found ? found.url : null
  }

  // Clicking a gallery photo selects the color it's tagged with (if any),
  // keeping the current size when that size still exists for the new color.
  const handleImageClick = (index) => {
    setSelectedImage(index)
    const clickedColor = imagesWithColor[index]?.color
    if (!clickedColor) return
    const match =
      product.variants.find((v) => v.color === clickedColor && v.size === selectedVariant?.size) ||
      product.variants.find((v) => v.color === clickedColor)
    if (match) setSelectedVariant(match)
  }

  const selectColor = (color) => {
    const match = product.variants.find(
      (v) => v.color === color && v.size === selectedVariant?.size && v.stock_quantity > 0
    )
    setSelectedVariant(match || product.variants.find((v) => v.color === color))
    const idx = imagesWithColor.findIndex((img) => img.color === color)
    if (idx !== -1) setSelectedImage(idx)
  }

  const selectSize = (size) => {
    if (!isSizeAvailable(size)) return
    const match = product.variants.find(
      (v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color)
    )
    setSelectedVariant(match || product.variants.find((v) => v.size === size))
  }

  const handleSizeClick = (size) => {
    if (isSizeAvailable(size)) {
      selectSize(size)
      return
    }
    const target =
      product.variants.find((v) => v.color === selectedVariant?.color && v.size === size) ||
      product.variants.find((v) => v.size === size)
    if (target) setNotifyVariant(target)
  }

  const handleNotifySubscribe = async () => {
    if (!authenticated) {
      setNotifyVariant(null)
      redirectToLogin()
      return
    }
    if (!notifyVariant) return
    setNotifyLoading(true)
    try {
      await subscribeStockNotification(notifyVariant.id)
      setSubscribedVariantIds((prev) => new Set(prev).add(notifyVariant.id))
      showToast("We'll notify you when this is back in stock")
    } catch (err) {
      if (err.response?.status === 400) {
        setSubscribedVariantIds((prev) => new Set(prev).add(notifyVariant.id))
        showToast("You're already subscribed for this item")
      } else {
        showToast('Could not set up notification')
      }
    } finally {
      setNotifyLoading(false)
      setNotifyVariant(null)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-4">
      <TopBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
          <a href="/" className="hover:text-blue-600 transition-colors duration-300">Home</a>
          <FiChevronRight size={12} />
          <a href="/shop" className="hover:text-blue-600 transition-colors duration-300">Shop</a>
          {product.category && (
            <>
              <FiChevronRight size={12} />
              <a href={`/shop?category=${product.category.slug}`} className="hover:text-blue-600 transition-colors duration-300">
                {product.category.name}
              </a>
            </>
          )}
          <FiChevronRight size={12} />
          <span className="text-slate-600">{product.name}</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-[420px_1fr_300px] gap-8 items-start">

          {/* Column 1 — Image gallery */}
          <div className="w-full max-w-sm mx-auto lg:mx-0">
            <div
              className="relative h-[380px] flex items-center justify-center rounded-2xl overflow-hidden bg-#FFFFFF mb-3 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onClick={() => setFullscreen(true)}
            >
              <img
                key={selectedImage}
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain scale-110 transition-all duration-300 animate-fade-in"
                style={
                  isZooming
                    ? { transform: 'scale(1.8)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
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
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => handleImageClick(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 bg-slate-50 transition-all duration-300 ${i === selectedImage ? 'border-blue-600' : 'border-transparent hover:border-slate-300'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 2 — Details & purchase options */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-1.5">
              {product.brand && (
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  {product.brand.name}
                </span>
              )}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all duration-300"
                >
                  <FiShare2 size={15} />
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:border-red-300 transition-all duration-300"
                >
                  <FiHeart
                    size={15}
                    className={`transition-all duration-300 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-400'}`}
                  />
                </button>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1.5">{truncateWords(product.name, 10)}</h1>

            <div className="flex items-center gap-2 mb-2 text-sm">
              <span className="flex items-center gap-[1px]">
                {[1, 2, 3, 4, 5].map((i) =>
                  i <= Math.round(avgRating) ? (
                    <FaStar key={i} size={12} className="text-yellow-400" />
                  ) : (
                    <FaRegStar key={i} size={12} className="text-slate-300" />
                  )
                )}
              </span>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-slate-500 hover:text-blue-600 transition-colors duration-300"
              >
                Ratings {reviewCount}
              </button>
            </div>

            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-2xl font-bold text-blue-600">{formatPrice(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-base font-medium text-orange-500 line-through decoration-1 decoration-orange-400">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full">
                    -{discountPercent}%
                  </span>
                </>
              )}
              {stock !== null && (
                <span className="flex items-center gap-1.5 text-sm ml-1">
                  {stock > 0 ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-stock-pulse" />
                      <span className="text-green-600 font-medium">In Stock</span>
                      {stock <= 10 && <span className="text-orange-500 text-xs">— Only {stock} left</span>}
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    </>
                  )}
                </span>
              )}
            </div>

            {colors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-800 mb-2.5">
                  Color Family
                  {selectedVariant?.color && (
                    <span className="ml-2 font-normal text-slate-500">{selectedVariant.color}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((color) => {
                    const swatchImg = colorSwatchImage(color)
                    const isSelected = selectedVariant?.color === color
                    return (
                      <button
                        key={color}
                        title={color}
                        onClick={() => selectColor(color)}
                        className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all duration-300 hover:scale-108 ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-400'
                          }`}
                      >
                        {swatchImg ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <img src={swatchImg} alt={color} className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] font-medium text-slate-600 px-1 text-center leading-tight">
                            {color}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-800 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const available = isSizeAvailable(size)
                    const isSelected = selectedVariant?.size === size
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeClick(size)}
                        className={`min-w-[44px] h-11 px-3 rounded-lg border text-sm font-medium transition-all duration-300 ${!available
                          ? 'border-slate-100 text-slate-300 bg-slate-50 hover:border-blue-300 hover:text-blue-400'
                          : isSelected
                            ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200 hover:scale-105'
                            : 'border-slate-200 text-slate-700 hover:border-slate-400 hover:scale-105'
                          }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {product.size_chart && (
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline mb-4 -mt-1"
              >
                <FiMaximize2 size={13} /> Size Guide
              </button>
            )}

            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-800 mb-2">Quantity</p>
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
                onClick={handleBuyNow}
                disabled={!inStock || buyNowLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {buyNowLoading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {buyNowLoading ? 'Processing...' : 'Buy Now'}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold transition-all duration-300 overflow-hidden ${added
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02] active:scale-95'
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
            </div>
          </div>

          {/* Column 3 — Delivery & return sidebar */}
          <aside className="w-full lg:sticky lg:top-24 space-y-4">
            <div className="border border-slate-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Delivery Options</p>
              <div className="divide-y divide-slate-50">
                {deliveryInfo.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                    <Icon size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-slate-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Return & Warranty</p>
              <div className="divide-y divide-slate-50">
                {returnInfo.map(({ icon: Icon, title, desc, comingSoon }) => (
                  <div key={title} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                    <Icon size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                        {title}
                        {comingSoon && (
                          <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Soon</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
            className="w-full h-full object-contain animate-scale-in"
          />
        </div>
      )}

      {notifyVariant && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNotifyVariant(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <FiBell className="text-blue-500" size={22} />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">
              {notifyVariant.color} / {notifyVariant.size} is out of stock
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              We'll email you as soon as this is available again.
            </p>
            {subscribedVariantIds.has(notifyVariant.id) ? (
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm py-3">
                <FiCheckCircle size={16} /> You're on the list
              </div>
            ) : (
              <button
                onClick={handleNotifySubscribe}
                disabled={notifyLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 disabled:opacity-60"
              >
                {notifyLoading ? 'Please wait...' : 'Notify Me'}
              </button>
            )}
            <button
              onClick={() => setNotifyVariant(null)}
              className="mt-3 text-sm text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSizeGuide && product.size_chart && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FiMaximize2 size={16} className="text-blue-500" /> Size Guide
              </h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-slate-400 hover:text-slate-600">
                <FiX size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              All measurements in {product.size_chart.unit === 'cm' ? 'centimeters' : 'inches'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="pb-2 pr-3">Size</th>
                    <th className="pb-2 pr-3">Chest</th>
                    <th className="pb-2 pr-3">Waist</th>
                    <th className="pb-2 pr-3">Hip</th>
                    <th className="pb-2">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {product.size_chart.rows.map((row) => (
                    <tr key={row.size} className="border-b border-slate-50 last:border-0">
                      <td className="py-2 pr-3 font-semibold text-slate-800">{row.size}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.chest ?? '—'}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.waist ?? '—'}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.hip ?? '—'}</td>
                      <td className="py-2 text-slate-600">{row.length ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail