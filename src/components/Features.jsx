import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi'

const features = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over ৳2,500', href: '/shipping-info' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30 days return policy', comingSoon: true },
  { icon: FiShield, title: 'Secure Payment', desc: 'COD & SSLCommerz payment', href: '/faq' },
  { icon: FiHeadphones, title: '24/7 Support', desc: "We're here to help", href: '/contact' },
]

const Features = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map(({ icon: Icon, title, desc, comingSoon, href }) => {
          const content = (
            <>
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <Icon size={18} className="sm:hidden" />
                <Icon size={20} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold text-slate-800 text-sm sm:text-[15px]">{title}</p>
                  {comingSoon && (
                    <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{desc}</p>
              </div>
            </>
          )

          if (comingSoon) {
            return (
              <div
                key={title}
                onClick={() => alert('Easy Returns feature is coming soon!')}
                className="group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
              >
                {content}
              </div>
            )
          }

          return (
            <a
              key={title}
              href={href}
              className="group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {content}
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default Features