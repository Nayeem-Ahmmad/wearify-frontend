import { FiArrowRight, FiZap, FiPercent, FiStar } from 'react-icons/fi'

const banners = [
  {
    title: 'New Collection\nSummer 2026',
    subtitle: 'Fresh styles just landed',
    cta: 'Explore Now',
    href: '/shop?ordering=-created_at',
    icon: FiStar,
    gradient: 'from-purple-600 to-indigo-600',
  },
  {
    title: 'Up to 30% OFF\nOn All Accessories',
    subtitle: 'Limited time offer',
    cta: 'Shop Accessories',
    href: '/shop?category=accessories',
    icon: FiPercent,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Stylish. Modern.\nMade for You.',
    subtitle: 'Discover the full collection',
    cta: 'Shop Now',
    href: '/shop',
    icon: FiZap,
    gradient: 'from-emerald-500 to-teal-500',
  },
]

const PromoBanners = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-3 gap-4">
        {banners.map((b) => {
          const Icon = b.icon
          return (
            <a
              key={b.title}
              href={b.href}
              className={`relative overflow-hidden rounded-2xl p-7 bg-gradient-to-br ${b.gradient} hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group min-h-[190px] flex flex-col justify-between`}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute -bottom-10 -left-6 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="relative w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4">
                <Icon className="text-white" size={18} />
              </div>

              <div className="relative">
                <p className="text-xs font-medium text-white/70 mb-1">{b.subtitle}</p>
                <h3 className="font-extrabold text-xl whitespace-pre-line mb-4 text-white leading-tight">
                  {b.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  {b.cta}
                  <FiArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default PromoBanners