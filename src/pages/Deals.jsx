import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import { getDeals } from '../api/products'

const DealsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getDeals({ page })
      .then((data) => {
        setProducts(data.results || data)
        setCount(data.count || (data.results || data).length)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 py-14">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#EF4444_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#F97316_0%,_transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-orange-600 mb-2">
              <FiZap size={13} className="animate-pulse" /> LIMITED TIME OFFERS
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Today's Deals</h1>
            <p className="text-slate-500">{count} product{count !== 1 ? 's' : ''} on sale right now</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <FiZap className="mx-auto text-slate-300 mb-4" size={40} />
              <p className="text-slate-500">No active deals right now — check back soon!</p>
            </div>
          ) : (
            products.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))
          )}
        </div>

        {count > 12 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full border border-slate-200 text-sm disabled:opacity-40 hover:border-orange-500 transition-all duration-300"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={products.length < 12}
              className="px-4 py-2 rounded-full border border-slate-200 text-sm disabled:opacity-40 hover:border-orange-500 transition-all duration-300"
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

export default DealsPage