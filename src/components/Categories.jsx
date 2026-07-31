import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { getCategories } from '../api/products'
import { API_BASE_URL } from '../api/axios'

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
]

const getCategoryImage = (cat) => {
  if (!cat.image) return null
  return cat.image.startsWith('http') ? cat.image : `${API_BASE_URL}${cat.image}`
}

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then((data) => setCategories((data.results || data).slice(0, 6)))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && categories.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">Shop by Categories</h2>
        <a href="/categories" className="text-sm font-medium text-blue-600 hover:underline">
          View All Categories →
        </a>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-slate-100 animate-pulse" />
          ))
          : categories.map((cat, idx) => {
            const image = getCategoryImage(cat)
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {image ? (
                  <img
                    src={image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % gradients.length]}`} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-white text-xs font-semibold leading-tight">{cat.name}</p>
                  {typeof cat.product_count === 'number' && (
                    <p className="text-white/70 text-[10px] mt-0.5">{cat.product_count} Items</p>
                  )}
                  <div className="flex items-center gap-1 text-[10px] font-medium text-white mt-1.5 max-h-0 opacity-0 group-hover:max-h-6 group-hover:opacity-100 transition-all duration-300">
                    Shop Now <FiArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            )
          })}
      </div>
    </section>
  )
}

export default Categories