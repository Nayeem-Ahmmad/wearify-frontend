import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiGrid, FiArrowRight } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.results || data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">
              BROWSE
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Shop by Category</h1>
            <p className="text-slate-500">Find exactly what you're looking for</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <FiGrid className="mx-auto text-slate-300 mb-4" size={40} />
            <p className="text-slate-500">No categories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {categories.map((cat, idx) => {
              const image = getCategoryImage(cat)
              return (
                <motion.a
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-white font-bold text-sm leading-tight">{cat.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {typeof cat.product_count === 'number' && (
                        <p className="text-white/70 text-[10px]">{cat.product_count} Products</p>
                      )}
                      {cat.children && cat.children.length > 0 && (
                        <>
                          <span className="text-white/40 text-[10px]">•</span>
                          <p className="text-white/70 text-[10px]">{cat.children.length} Subcategories</p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-white mt-1.5 max-h-0 opacity-0 group-hover:max-h-6 group-hover:opacity-100 transition-all duration-300">
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        Shop Now <FiArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default CategoriesPage