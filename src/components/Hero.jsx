import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { getBanners } from '../api/products'

const Hero = () => {
  const [index, setIndex] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBanners()
      .then((data) => setSlides(data.results || data))
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

  // Box shape now matches the actual banner artwork ratio instead of a
  // fixed px height. Mobile banners are near-square/portrait (1080x1460),
  // desktop banners are wide (1600x590). This stops object-cover from
  // cropping the left-side text out on narrow screens.
  const boxRatio = 'aspect-[1080/1150] md:aspect-[1600/590]'

  if (loading) {
    return (
      <section className="px-3 md:px-6 py-4 md:py-6">
        <div className={`max-w-7xl mx-auto rounded-[28px] bg-slate-900 ${boxRatio} animate-pulse`} />
      </section>
    )
  }

  if (slides.length === 0) return null

  const slide = slides[index]

  return (
    <section className="px-3 md:px-6 py-4 md:py-6">
      <div className="relative max-w-7xl mx-auto rounded-[28px] overflow-hidden border border-white/10">
        <AnimatePresence mode="wait">
          <motion.a
            key={`banner-${slide.id}`}
            href={slide.link || '#'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`block w-full ${boxRatio}`}
          >
            {/* Mobile-optimized artwork (falls back to the desktop image if
                a slide hasn't been given a dedicated mobile crop yet) */}
            <img
              src={slide.mobileImage || slide.image}
              alt={slide.title}
              className="w-full h-full object-cover md:hidden"
            />
            {/* Desktop / wide artwork */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover hidden md:block"
            />
          </motion.a>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm shadow-lg ring-1 ring-white/15 rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all duration-300 z-10"
            >
              <FiChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm shadow-lg ring-1 ring-white/15 rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all duration-300 z-10"
            >
              <FiChevronRight size={18} className="text-white" />
            </button>
          </>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-gradient-to-r from-sky-400 to-purple-400' : 'w-1.5 bg-white/25'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero