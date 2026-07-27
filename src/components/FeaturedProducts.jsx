import ProductCard from './ProductCard'

const products = [
  { id: 1, name: 'Bomber Jacket', price: 89, rating: 5.0, reviews: 85, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80' },
  { id: 2, name: 'Premium Hoodie', price: 49, rating: 4.8, reviews: 50, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&q=80' },
  { id: 3, name: 'Polarized Sunglasses', price: 25, rating: 4.5, reviews: 35, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80' },
  { id: 4, name: 'Leather Watch', price: 129, rating: 4.7, reviews: 65, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&q=80' },
  { id: 5, name: 'Travel Backpack', price: 69, rating: 4.6, reviews: 90, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80' },
  { id: 6, name: 'Classic Sneakers', price: 59, rating: 4.8, reviews: 80, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80' },
]

const FeaturedProducts = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">Featured Products</h2>
        <a href="/shop" className="text-sm font-medium text-blue-600 hover:underline">
          View All Products →
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts