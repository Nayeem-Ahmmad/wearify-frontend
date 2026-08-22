import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import { getDeals } from '../api/products'

const DealsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [count, setCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [page, setPage] = useState(1)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(false)
    getDeals({ page })
      .then((data) => {
        setProducts(data.results || data)
        setCount(data.count || (data.results || data).length)
        setHasNext(Boolean(data.next))
        setHasPrevious(Boolean(data.previous))
      })
      .catch(() => {
        setProducts([])
        setCount(0)
        setHasNext(false)
        setHasPrevious(false)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [page, retryKey])

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <TopBar />
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1C1C1E] via-[#B3270A] to-[#F85606] py-8 sm:py-12 md:py-14">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_12%_20%,_#FF8A3D_0%,_transparent_42%),radial-gradient(circle_at_88%_85%,_#F85606_0%,_transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-[#FFD3A8] mb-2 uppercase">
              <FiZap size={13} className="animate-pulse" /> Limited Time Offers
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">
              Today's Deals
            </h1>
            <p className="flex items-center gap-1.5 text-white/80 text-xs sm:text-sm">
              <FiClock size={13} />
              {count} product{count !== 1 ? 's' : ''} on sale right now
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= PRODUCT GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 py-6 sm:py-10">
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 xs:gap-3 sm:gap-4">
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : error ? (
            <div className="col-span-full text-center py-14 sm:py-16 bg-white rounded-2xl border border-[#ECECEE]">
              <p className="text-sm text-[#6B7280] mb-3">Something went wrong loading deals.</p>
              <button
                onClick={() => setRetryKey((k) => k + 1)}
                className="text-sm font-semibold text-[#F85606] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-14 sm:py-16 bg-white rounded-2xl border border-[#ECECEE]">
              <FiZap className="mx-auto text-[#D1D5DB] mb-4" size={40} />
              <p className="text-[#6B7280] text-sm sm:text-base">No active deals right now — check back soon!</p>
            </div>
          ) : (
            products.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.4) }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))
          )}
        </div>

        {/* ================= PAGINATION ================= */}
        {!loading && !error && (hasNext || hasPrevious) && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={!hasPrevious}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-[#E5E7EB] bg-white text-xs sm:text-sm font-medium text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#F85606] hover:text-[#F85606] transition-all duration-200"
            >
              <FiChevronLeft size={15} />
              <span className="hidden xs:inline">Previous</span>
            </button>
            <span className="text-xs sm:text-sm font-semibold text-[#191919] bg-white border border-[#ECECEE] rounded-full px-4 py-2">
              Page {page}
            </span>
            <button
              onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={!hasNext}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-[#E5E7EB] bg-white text-xs sm:text-sm font-medium text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#F85606] hover:text-[#F85606] transition-all duration-200"
            >
              <span className="hidden xs:inline">Next</span>
              <FiChevronRight size={15} />
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default DealsPage