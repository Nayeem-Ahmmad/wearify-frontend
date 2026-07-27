import ProductCard from './ProductCard'

const newArrivals = [
  { id: 1, name: 'Oversized Cargo Pants', price: 65, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80' },
  { id: 2, name: 'Minimalist Crossbody Bag', price: 45, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&q=80' },
  { id: 3, name: 'Retro High-Top Sneakers', price: 89, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&q=80' },
  { id: 4, name: 'Silk Scarf Print', price: 22, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&q=80' },
]

const NewArrivals = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">New Arrivals</h2>
        <a href="/new-arrivals" className="text-sm font-medium text-blue-600 hover:underline">
          View All →
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {newArrivals.map((p) => (
          <ProductCard key={p.id} product={p} badge="NEW" />
        ))}
      </div>
    </section>
  )
}

export default NewArrivals