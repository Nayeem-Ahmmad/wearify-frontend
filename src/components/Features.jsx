import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi'

const features = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30 days return policy', comingSoon: true },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure payment' },
  { icon: FiHeadphones, title: '24/7 Support', desc: "We're here to help" },
]

const Features = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map(({ icon: Icon, title, desc, comingSoon }) => (
          <div
            key={title}
            onClick={() => comingSoon && alert('Easy Returns feature is coming soon!')}
            className={`flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
              comingSoon ? 'cursor-pointer relative' : ''
            }`}
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:scale-110 transition-transform duration-300">
              <Icon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-slate-800 text-sm">{title}</p>
                {comingSoon && (
                  <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features