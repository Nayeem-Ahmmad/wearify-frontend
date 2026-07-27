const brands = ['NIKE', 'ADIDAS', 'PUMA', 'ZARA', 'GUCCI', 'FOSSIL', 'H&M', 'ASOS']

const BrandPartners = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <p className="text-center text-sm text-slate-500 mb-6">Trusted by 1000+ Brands and Customers</p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {brands.map((b) => (
          <span
            key={b}
            className="text-xl font-bold tracking-wider text-slate-400 grayscale hover:grayscale-0 hover:text-slate-800 hover:scale-110 transition-all duration-300 cursor-default"
          >
            {b}
          </span>
        ))}
      </div>
    </section>
  )
}

export default BrandPartners