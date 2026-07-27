import { useEffect, useState } from 'react'
import { FiZap } from 'react-icons/fi'
import ProductCard from './ProductCard'

const flashProducts = [
  { id: 1, name: 'Smart Watch Series 9', price: 199, oldPrice: 249, discount: 20, rating: 4.5, reviews: 120, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
  { id: 2, name: 'Noise Cancelling Headphone', price: 59, oldPrice: 69, discount: 15, rating: 4.3, reviews: 96, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { id: 3, name: 'Running Shoes Pro', price: 74, oldPrice: 99, discount: 25, rating: 4.6, reviews: 64, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
  { id: 4, name: 'DSLR Camera', price: 449, oldPrice: 499, discount: 10, rating: 4.4, reviews: 75, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80' },
]

const getTimeLeft = () => {
  const end = new Date()
  end.setHours(end.getHours() + 50)
  const diff = end - new Date()
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  }
}

const FlashSale = () => {
  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Mins', value: time.mins },
    { label: 'Secs', value: time.secs },
  ]

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

            <div className="flex gap-2 mb-6">
              {units.map((u) => (
                <div key={u.label} className="bg-slate-800 rounded-lg px-3 py-2 text-center min-w-[52px]">
                  <div className="font-bold text-lg leading-none">{String(u.value).padStart(2, '0')}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{u.label}</div>
                </div>
              ))}
            </div>

            
              href="/deals"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              View All Deals →
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashProducts.map((p) => (
              <ProductCard key={p.id} product={p} dark />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlashSale