import ProductCard from './ProductCard'

const bestSellers = [
  { id: 1, name: 'Classic Denim Jacket', price: 79, rating: 4.9, reviews: 210, image: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=300&q=80' },
  { id: 2, name: 'Wireless Earbuds', price: 39, rating: 4.7, reviews: 180, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80' },
  { id: 3, name: 'Canvas Tote Bag', price: 29, rating: 4.6, reviews: 150, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&q=80' },
  { id: 4, name: 'Aviator Sunglasses', price: 35, rating: 4.8, reviews: 140, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80' },
]

const BestSellers = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">Best Sellers</h2>
        <a href="/shop?sort=best-selling" className="text-sm font-medium text-blue-600 hover:underline">
          View All →
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bestSellers.map((p) => (
          <ProductCard key={p.id} product={p} badge="Best Seller" />
        ))}
      </div>
    </section>
  )
}

export default BestSellers