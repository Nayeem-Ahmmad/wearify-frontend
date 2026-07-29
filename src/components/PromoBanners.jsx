const banners = [
  {
    title: 'New Collection\nSummer 2026',
    cta: 'Explore Now',
    href: '/shop?filter=new',
    gradient: 'from-purple-100 to-purple-200',
    text: 'text-purple-900',
  },
  {
    title: 'Up to 30% OFF\nOn All Accessories',
    cta: 'Shop Accessories',
    href: '/categories/accessories',
    gradient: 'from-orange-100 to-orange-200',
    text: 'text-orange-900',
  },
  {
    title: 'Stylish. Modern.\nMade for You.',
    cta: 'Shop Now',
    href: '/shop',
    gradient: 'from-green-100 to-green-200',
    text: 'text-green-900',
  },
]

const PromoBanners = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-3 gap-4">
        {banners.map((b) => (
          <a
            key={b.title}
            href={b.href}
            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${b.gradient} hover:shadow-xl transition-all duration-500 group`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <h3 className={`font-bold text-lg whitespace-pre-line mb-3 ${b.text}`}>
              {b.title}
            </h3>
            <span className={`text-sm font-medium underline-offset-4 group-hover:underline ${b.text}`}>
              {b.cta} →
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default PromoBanners