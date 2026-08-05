import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiClock } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import { getProducts } from '../api/products'

const NewArrivalsPage = () => {
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
    getProducts({ ordering: '-created_at', page })
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
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-blue-600 mb-2">
              <FiClock size={13} /> JUST LANDED
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">New Arrivals</h1>
            <p className="text-slate-500">{count} fresh products added recently</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : error ? (
            <div className="col-span-full text-center py-10">
              <p className="text-sm text-slate-500 mb-3">Something went wrong loading products.</p>
              <button onClick={() => setRetryKey((k) => k + 1)} className="text-sm font-medium text-blue-600 hover:underline">
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="col-span-full text-sm text-slate-400 py-10 text-center">No new products yet.</p>
          ) : (
            products.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <ProductCard product={p} badge="NEW" />
              </motion.div>
            ))
          )}
        </div>

        {(hasNext || hasPrevious) && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={!hasPrevious}
              className="px-4 py-2 rounded-full border border-slate-200 text-sm disabled:opacity-40 hover:border-blue-500 transition-all duration-300"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {page}</span>
            <button
              onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={!hasNext}
              className="px-4 py-2 rounded-full border border-slate-200 text-sm disabled:opacity-40 hover:border-blue-500 transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default NewArrivalsPage