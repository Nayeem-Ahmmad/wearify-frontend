import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiTag } from 'react-icons/fi'
import { getDeals } from '../api/products'
import { getProductImage, formatPrice } from '../utils/productHelpers'

const getDiscountPercent = (product) => {
  const variant = product.variants?.[0]
  if (!variant || variant.is_on_sale !== true) return 0

  const originalPrice = Number(variant.original_price ?? product.base_price)
  const currentPrice = Number(variant.price ?? product.base_price)

  if (!originalPrice || !currentPrice || currentPrice >= originalPrice) return 0
  return Math.round((1 - currentPrice / originalPrice) * 100)
}

const Hero = () => {
  const [index, setIndex] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDeals({ page_size: 20 })
      .then((data) => {
        const products = data.results || data
        const top = [...products]
          .map((p) => ({ ...p, _discount: getDiscountPercent(p) }))
          .sort((a, b) => b._discount - a._discount)
          .slice(0, 3)
        setSlides(top)
      })
      .catch(() => setSlides([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const next = () => setIndex((prev) => (prev + 1) % slides.length)
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)

  if (loading) {
    return (
      <section className="px-3 md:px-6 py-5 md:py-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-slate-50 h-[300px] md:h-[340px] animate-pulse" />
      </section>
    )
  }

  if (slides.length === 0) return null

  const slide = slides[index]
  const firstVariant = slide.variants?.[0]
  const currentPrice = Number(firstVariant?.price ?? slide.base_price)
  const originalPrice = Number(firstVariant?.original_price ?? slide.base_price)
  const hasDiscount = slide._discount > 0 && firstVariant?.is_on_sale === true && originalPrice > currentPrice

  return (
    <section className="px-3 md:px-6 py-5 md:py-8">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm">

        {/* Ambient brand wash — matches the radial gradient treatment used on Deals/Categories headers */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_10%_10%,_#2563EB_0%,_transparent_40%),radial-gradient(circle_at_90%_90%,_#9333EA_0%,_transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,white_0%,transparent_15%,transparent_85%,white_100%)]" />

        <div className="relative grid md:grid-cols-2 gap-3 md:gap-6 items-center px-6 md:px-10 py-9 md:py-12">

          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4 }}
              className="text-center md:text-left order-2 md:order-1"
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-blue-600 tracking-[0.2em] mb-4">
                <span className="w-6 h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                {slide.category?.name?.toUpperCase() || 'DEAL OF THE DAY'}
              </span>

              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6 line-clamp-2 max-w-md mx-auto md:mx-0">
                {slide.name}
              </h1>

              <a
                href={`/products/${slide.slug}`}
                className="group inline-flex items-center gap-2 bg-slate-900 text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-blue-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-200"
              >
                Shop Now <FiChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            </motion.div>
          </AnimatePresence>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] shrink-0">

              {/* Soft color podium glow behind the product photo */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-200/60 to-purple-200/60 blur-2xl" />

              <AnimatePresence mode="wait">
                <motion.a
                  key={`img-${slide.id}`}
                  href={`/products/${slide.slug}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4 }}
                  className="relative block w-full h-full rounded-xl overflow-hidden bg-slate-50 shadow-xl ring-1 ring-slate-100"
                >
                  <img
                    src={getProductImage(slide)}
                    alt={slide.name}
                    className="w-full h-full object-cover"
                  />
                </motion.a>
              </AnimatePresence>

              {slide._discount > 0 && (
                <motion.div
                  key={`badge-${slide.id}`}
                  initial={{ rotate: -6, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: -8, scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute -top-3 -right-3 z-10"
                >
                  {/* Swing-tag style badge — echoes the Wearify tag/badge identity used across the site */}
                  <div className="relative flex items-center gap-1 bg-gradient-to-br from-rose-500 to-orange-500 text-white pl-4 pr-3 py-2 rounded-lg rounded-tl-sm shadow-lg">
                    <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white ring-2 ring-rose-400" />
                    <FiTag size={11} className="opacity-90" />
                    <span className="text-[10px] font-bold leading-none">UP TO {slide._discount}%</span>
                  </div>
                </motion.div>
              )}

              {/* Floating price card — sits on the product photo, right-hand side of the hero */}
              <motion.div
                key={`price-${slide.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="absolute -bottom-4 -left-4 md:-left-6 z-10 bg-white rounded-2xl shadow-xl ring-1 ring-slate-100 px-4 py-2.5"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-slate-400 line-through">{formatPrice(originalPrice)}</span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="block text-[10px] font-bold text-rose-500 mt-0.5">
                    You save {slide._discount}%
                  </span>
                )}
              </motion.div>

            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg ring-1 ring-slate-100 rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 hover:ring-blue-200 transition-all duration-300 z-10"
            >
              <FiChevronLeft size={18} className="text-slate-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg ring-1 ring-slate-100 rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 hover:ring-blue-200 transition-all duration-300 z-10"
            >
              <FiChevronRight size={18} className="text-slate-700" />
            </button>
          </>
        )}

        {slides.length > 1 && (
          <div className="relative flex justify-center gap-1.5 pb-5 md:pb-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-gradient-to-r from-blue-600 to-purple-600' : 'w-1.5 bg-slate-200'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero