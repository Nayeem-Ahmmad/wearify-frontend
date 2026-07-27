import { useState } from 'react'

const TopBar = () => {
  const [lang, setLang] = useState('EN')

  return (
    <div className="w-full bg-slate-950 text-slate-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-6 hover:text-blue-400 transition-colors duration-300">🚚 Free Shipping on orders over $50</span>
            <span className="mx-6 hover:text-blue-400 transition-colors duration-300">⚡ Limited Time Offer — Up to 50% OFF</span>
            <span className="mx-6 hover:text-blue-400 transition-colors duration-300">🚚 Free Shipping on orders over $50</span>
            <span className="mx-6 hover:text-blue-400 transition-colors duration-300">⚡ Limited Time Offer — Up to 50% OFF</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <a href="/track-order" className="hover:text-blue-400 transition-colors duration-300">Track Order</a>
          <a href="/help" className="hover:text-blue-400 transition-colors duration-300">Help Center</a>
          <button
            onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')}
            className="hover:text-blue-400 transition-colors duration-300"
          >
            {lang}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopBar