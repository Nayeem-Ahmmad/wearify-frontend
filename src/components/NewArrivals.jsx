import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import ProductGridSkeleton from './ProductGridSkeleton'
import { getProducts } from '../api/products'

const NewArrivals = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ ordering: '-created_at', page_size: 4 })
      .then((data) => setProducts(data.results || data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">New Arrivals</h2>
        <a href="/new-arrivals" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 ? (
          <p className="col-span-full text-sm text-slate-400">No products available yet.</p>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} badge="NEW" />)
        )}
      </div>
    </section>
  )
}

export default NewArrivals