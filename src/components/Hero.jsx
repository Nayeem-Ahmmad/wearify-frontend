import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const slides = [
  {
    tag: 'SUMMER SALE',
    title: 'Upgrade Your Style. Elevate You.',
    desc: 'Discover the latest trends in fashion, shoes, accessories and more. Up to 50% OFF!',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=80',
    discount: '50% OFF',
  },
  {
    tag: 'NEW COLLECTION',
    title: 'Step Into Summer 2026.',
    desc: 'Fresh arrivals every week — curated for your everyday style.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80',
    discount: 'NEW',
  },
  {
    tag: 'ACCESSORIES',
    title: 'Complete Every Look.',
    desc: 'Watches, bags and sunglasses to finish your outfit.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80',
    discount: '30% OFF',
  },
]

const Hero = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const next = () => setIndex((prev) => (prev + 1) % slides.length)
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length)
  const slide = slides[index]

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-14 md:py-20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block text-sm font-semibold text-blue-600 tracking-widest mb-3"
              >
                {slide.tag}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 mb-8 max-w-md"
              >
                {slide.desc}
              </motion.p>

              <motion.a
                href="/shop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3 rounded-full font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-200 animate-pulse-slow"
              >
                Shop Now <FiChevronRight />
              </motion.a>
            </div>

            <div className="relative flex justify-center">
              <motion.img
                src={slide.image}
                alt={slide.title}
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full max-w-md h-[420px] rounded-3xl object-cover shadow-2xl"
              />  
              <motion.div
                initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
                animate={{ rotate: -8, scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="absolute -top-4 -right-2 md:-right-6 bg-blue-600 text-white rounded-full w-20 h-20 flex flex-col items-center justify-center text-xs font-bold shadow-xl"
              >
                <span>UP TO</span>
                <span className="text-sm">{slide.discount}</span>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110"
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110"
        >
          <FiChevronRight size={20} />
        </button>

        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero