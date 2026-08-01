import { useEffect, useState } from 'react'
import { FiZap } from 'react-icons/fi'
import ProductCard from './ProductCard'
import ProductGridSkeleton from './ProductGridSkeleton'
import { getDeals } from '../api/products'

const getTimeLeft = (endTime) => {
  const diff = new Date(endTime) - new Date()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  }
}

const FlashSale = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = useState(false)
  const [earliestEnd, setEarliestEnd] = useState(null)
  const [time, setTime] = useState(null)

  useEffect(() => {
    getDeals({ page_size: 4 })
      .then((data) => {
        const results = data.results || data
        setProducts(results)

        const endDates = results
          .flatMap((p) => p.variants || [])
          .filter((v) => v.is_on_sale && v.discount_end)
          .map((v) => new Date(v.discount_end))

        if (endDates.length > 0) {
          const soonest = new Date(Math.min(...endDates))
          setEarliestEnd(soonest)
          setTime(getTimeLeft(soonest))
        }
      })
      .catch(() => setProducts([]))
      .finally(() => {
        setLoading(false)
        setChecked(true)
      })
  }, [])

  useEffect(() => {
    if (!earliestEnd) return
    const timer = setInterval(() => {
      const left = getTimeLeft(earliestEnd)
      setTime(left)
      if (!left) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [earliestEnd])

  if (!checked || products.length === 0) return null

  const units = time
    ? [
      { label: 'Days', value: time.days },
      { label: 'Hours', value: time.hours },
      { label: 'Mins', value: time.mins },
      { label: 'Secs', value: time.secs },
    ]
    : null

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="rounded-3xl bg-slate-950 text-white p-6 md:p-8">
        <div className="grid md:grid-cols-[220px_1fr] gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiZap className="text-orange-400 animate-pulse" />
              <h3 className="font-bold text-lg">Flash Sale</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">Limited time offer! Grab yours now</p>

            {units && (
              <div className="flex gap-2 mb-6">
                {units.map((u) => (
                  <div key={u.label} className="bg-slate-800 rounded-lg px-3 py-2 text-center min-w-[52px]">
                    <div className="font-bold text-lg leading-none">{String(u.value).padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{u.label}</div>
                  </div>
                ))}
              </div>
            )}

            <a href="/deals" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
              View All Deals
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              products.map((p) => <ProductCard key={p.id} product={p} dark />)
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlashSale