import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiZap } from 'react-icons/fi'
import { getDeals } from '../api/products'
import { getProductImage, formatPrice } from '../utils/productHelpers'

const getDiscountPercent = (product) => {
  const variant = product.variants?.find(
    (v) => v.price_override != null && Number(v.price_override) < Number(product.base_price)
  )
  if (!variant) return 0
  return Math.round((1 - Number(variant.price_override) / Number(product.base_price)) * 100)
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
  const finalPrice = slide.base_price * (1 - slide._discount / 100)

  return (
    <section className="px-3 md:px-6 py-5 md:py-8">
      <div className="max-w-7xl mx-auto rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center px-6 md:px-14 py-8 md:py-10">

          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4 }}
              className="text-center md:text-left order-2 md:order-1"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 tracking-widest mb-3 bg-blue-50 px-3 py-1.5 rounded-full">
                <FiZap size={12} /> {slide.category?.name?.toUpperCase() || 'DEAL OF THE DAY'}
              </span>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight mb-3 line-clamp-2 max-w-md mx-auto md:mx-0">
                {slide.name}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">{formatPrice(finalPrice)}</span>
                {slide._discount > 0 && (
                  <>
                    <span className="text-sm text-orange-500 line-through">{formatPrice(slide.base_price)}</span>
                    <span className="text-xs font-bold text-white bg-red-500 px-2.5 py-1 rounded-full">
                      -{slide._discount}%
                    </span>
                  </>
                )}
              </div>

              <a
                href={`/products/${slide.slug}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-200"
              >
                Shop Now <FiChevronRight size={16} />
              </a>
            </motion.div>
          </AnimatePresence>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] shrink-0">
              <AnimatePresence mode="wait">
                <motion.a
                  key={`img-${slide.id}`}
                  href={`/products/${slide.slug}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4 }}
                  className="block w-full h-full rounded-3xl overflow-hidden bg-slate-50 shadow-xl"
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
                  initial={{ rotate: -8, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: -8, scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute -top-2.5 -right-2.5 bg-red-500 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center text-[9px] font-bold shadow-lg border-4 border-white z-10"
                >
                  <span>UP TO</span>
                  <span className="text-[11px]">{slide._discount}%</span>
                </motion.div>
              )}

              {slides.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white shadow-md border border-slate-100 rounded-full w-8 h-8 flex items-center justify-center hover:scale-110 hover:border-blue-200 transition-all duration-300 z-10"
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white shadow-md border border-slate-100 rounded-full w-8 h-8 flex items-center justify-center hover:scale-110 hover:border-blue-200 transition-all duration-300 z-10"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-5 md:pb-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200'
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