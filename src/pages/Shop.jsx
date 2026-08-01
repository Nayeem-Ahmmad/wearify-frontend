import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import ShopFilters from '../components/ShopFilters'
import { getProducts } from '../api/products'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    min_price: '',
    max_price: '',
    search: searchParams.get('search') || '',
    ordering: '',
    on_sale: '',
  })

  useEffect(() => {
    setLoading(true)
    const params = { page }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value
    })

    getProducts(params)
      .then((data) => {
        setProducts(data.results || data)
        setCount(data.count || (data.results || data).length)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [filters, page])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Shop</h1>
            <p className="text-sm text-slate-500 mt-1">{count} products found</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={filters.ordering}
                onChange={(e) => handleFilterChange({ ...filters, ordering: e.target.value })}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-full border border-slate-200 text-sm outline-none focus:border-blue-500 transition-all duration-300 cursor-pointer"
              >
                <option value="">Sort: Default</option>
                <option value="base_price">Price: Low to High</option>
                <option value="-base_price">Price: High to Low</option>
                <option value="-created_at">Newest First</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-sm"
            >
              <FiFilter size={14} /> Filters
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden lg:block">
            <ShopFilters filters={filters} onChange={handleFilterChange} />
          </aside>

          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <p className="font-semibold">Filters</p>
                  <button onClick={() => setShowFilters(false)}>
                    <FiX size={20} />
                  </button>
                </div>
                <ShopFilters filters={filters} onChange={handleFilterChange} />
              </div>
            </div>
          )}

          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {loading ? (
                <ProductGridSkeleton count={9} />
              ) : products.length === 0 ? (
                <p className="col-span-full text-sm text-slate-400 py-10 text-center">
                  No products found matching your filters.
                </p>
              ) : (
                products.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </div>

            {count > 12 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full border border-slate-200 text-sm disabled:opacity-40 hover:border-blue-500 transition-all duration-300"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">Page {page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={products.length < 12}
                  className="px-4 py-2 rounded-full border border-slate-200 text-sm disabled:opacity-40 hover:border-blue-500 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Shop