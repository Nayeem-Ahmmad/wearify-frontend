import { useEffect, useState } from 'react'
import { FiZap, FiChevronRight } from 'react-icons/fi'
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
    { label: 'Hrs', value: time.hours },
    { label: 'Mins', value: time.mins },
    { label: 'Secs', value: time.secs },
  ]

  const products = flashSale.products
  // Duplicate the list so the marquee can loop seamlessly (right -> left)
  const marqueeProducts = [...products, ...products]
  // Duration scales with item count so speed stays consistent regardless of list length
  const duration = Math.max(products.length * 4, 12)

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#0c1030] to-slate-950 text-white p-6 md:p-10 overflow-hidden">

        {/* Ambient glow accents */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-rose-600/20 blur-[100px] rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 right-0 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

          <div className="flex items-center gap-4 md:gap-6">
            {/* Neon lightning bolt */}
            <svg
              viewBox="0 0 100 200"
              className="w-10 h-20 md:w-14 md:h-28 shrink-0"
              style={{ filter: 'drop-shadow(0 0 6px #f43f5e) drop-shadow(0 0 16px #ec4899)' }}
            >
              <polygon
                points="70,0 20,110 55,110 30,200 90,80 55,80"
                fill="none"
                stroke="#fb7185"
                strokeWidth="5"
                strokeLinejoin="round"
              />
            </svg>

            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-rose-400 tracking-[0.2em] uppercase mb-1">
                <FiZap size={12} /> Limited Time Offer
              </span>
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tight leading-none">
                FLASH <span className="text-rose-500">SALE</span>
              </h2>
              <p className="text-slate-400 text-sm mt-2">Grab your favorites before it's gone!</p>

              <a
                href="/deals"
                className="inline-flex items-center gap-2 border border-white/25 text-white px-5 py-2 rounded-full text-xs md:text-sm font-semibold mt-4 hover:bg-white/10 transition-all duration-300"
              >
                Shop Now <FiChevronRight size={14} />
              </a>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xs font-bold text-slate-300 tracking-widest uppercase mb-2">Sale Ends In</p>
            <div className="flex gap-2 md:justify-end">
              {units.map((u) => (
                <div
                  key={u.label}
                  className="bg-slate-900/80 border border-blue-500/30 rounded-xl px-3 md:px-4 py-2 text-center min-w-[56px] md:min-w-[64px] shadow-[0_0_16px_rgba(59,130,246,0.15)]"
                >
                  <div className="font-extrabold text-xl md:text-2xl leading-none text-white">
                    {String(u.value).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-blue-400 uppercase tracking-wide mt-1">{u.label}</div>
                </div>
              ))}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-blue-400 mt-3 md:justify-end">
              <FiZap size={12} /> Hurry up! Limited stock available.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div
            className="flex gap-4 w-max animate-flash-marquee group-hover:[animation-play-state:paused]"
            style={{ animationDuration: `${duration}s` }}
          >
            {marqueeProducts.map((p, i) => (
              <div key={`${p.id}-${i}`} className="w-32 md:w-40 shrink-0">
                <ProductCard product={p} dark />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flash-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-flash-marquee {
          animation-name: flash-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </section>
  )
}

export default FlashSale