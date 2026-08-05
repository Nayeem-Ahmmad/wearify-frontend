import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import ProductGridSkeleton from './ProductGridSkeleton'
import { getProducts } from '../api/products'

const BestSellers = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ page_size: 6 })
      .then((data) => setProducts(data.results || data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">Best Sellers</h2>
        <a href="/shop" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : products.length === 0 ? (
          <p className="col-span-full text-sm text-slate-400">No products available yet.</p>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} badge="Best Seller" />)
        )}
      </div>
    </section>
  )
}

export default BestSellers