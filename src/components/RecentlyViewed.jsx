import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

const STORAGE_KEY = 'wearify_recently_viewed'

export const addToRecentlyViewed = (product) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const filtered = existing.filter((p) => p.slug !== product.slug)
  const updated = [product, ...filtered].slice(0, 8)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

const RecentlyViewed = ({ excludeSlug }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    setItems(stored.filter((p) => p.slug !== excludeSlug))
  }, [excludeSlug])

  if (items.length === 0) return null

  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold text-slate-900 mb-5">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  )
}

export default RecentlyViewed