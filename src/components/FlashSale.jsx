import { useEffect, useState } from 'react'
import { FiZap } from 'react-icons/fi'
import ProductCard from './ProductCard'
import { getActiveFlashSale } from '../api/products'

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
  const [flashSale, setFlashSale] = useState(null)
  const [time, setTime] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    getActiveFlashSale()
      .then((data) => {
        setFlashSale(data)
        setTime(getTimeLeft(data.end_time))
      })
      .catch(() => setFlashSale(null))
      .finally(() => setChecked(true))
  }, [])

  useEffect(() => {
    if (!flashSale) return
    const timer = setInterval(() => {
      const left = getTimeLeft(flashSale.end_time)
      setTime(left)
      if (!left) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [flashSale])

  if (!checked || !flashSale || !time || flashSale.products.length === 0) return null

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Mins', value: time.mins },
    { label: 'Secs', value: time.secs },
  ]

  const loopProducts = flashSale.products.length > 1 ? [...flashSale.products, ...flashSale.products] : flashSale.products

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="rounded-3xl bg-slate-950 text-white p-6 md:p-8 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <FiZap className="text-orange-400 animate-pulse" />
          <h3 className="font-bold text-lg">{flashSale.title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">Limited time offer! Grab yours now</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2">
            {units.map((u) => (
              <div key={u.label} className="bg-slate-800 rounded-lg px-3 py-2 text-center min-w-[52px]">
                <div className="font-bold text-lg leading-none">{String(u.value).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-400 mt-1">{u.label}</div>
              </div>
            ))}
          </div>

          <a href="/deals" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
            View All Deals
          </a>
        </div>

        <div className="overflow-hidden -mx-6 md:-mx-8 px-6 md:px-8">
          <div className="animate-flash-marquee w-max gap-4">
            {loopProducts.map((p, idx) => (
              <div key={`${p.id}-${idx}`} className="w-40 md:w-48 shrink-0">
                <ProductCard product={p} dark />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlashSale