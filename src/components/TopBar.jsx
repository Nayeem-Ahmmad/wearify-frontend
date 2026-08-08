import { useState } from 'react'
import { FiTruck, FiZap, FiGlobe } from 'react-icons/fi'

const announcements = [
  { icon: FiTruck, text: 'Free Shipping on orders over ৳2,500' },
  { icon: FiZap, text: 'Limited Time Offer — Up to 50% OFF' },
]

const TopBar = () => {
  const [lang, setLang] = useState('EN')

  const marqueeItems = [...announcements, ...announcements]

  return (
    <div className="w-full bg-slate-950 text-slate-300 text-xs border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {marqueeItems.map(({ icon: Icon, text }, i) => (
              <span key={i} className="inline-flex items-center gap-4 mx-6">
                <span className="inline-flex items-center gap-2 font-medium tracking-wide hover:text-blue-400 transition-colors duration-300">
                  <Icon size={13} className="text-blue-400" />
                  {text}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/15" />
              </span>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-5 shrink-0 text-slate-300">
          <a href="/track-order" className="font-medium hover:text-blue-400 transition-colors duration-300">
            Track Order
          </a>
          <span className="w-px h-3 bg-white/10" />
          <a href="/help" className="font-medium hover:text-blue-400 transition-colors duration-300">
            Help Center
          </a>
          <span className="w-px h-3 bg-white/10" />
          <button
            onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')}
            className="flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full border border-white/10 hover:border-blue-400/40 hover:text-blue-400 transition-all duration-300"
          >
            <FiGlobe size={12} />
            {lang}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopBar