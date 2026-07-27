const categories = [
  { name: "Men's Clothing", count: 120, image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=300&q=80' },
  { name: "Women's Clothing", count: 98, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80' },
  { name: 'Shoes', count: 85, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80' },
  { name: 'Bags & Backpacks', count: 60, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80' },
  { name: 'Watches', count: 45, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&q=80' },
  { name: 'Accessories', count: 75, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80' },
]

const Categories = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">Shop by Categories</h2>
        <a href="/categories" className="text-sm font-medium text-blue-600 hover:underline">
          View All Categories →
        </a>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat) => (
          
            key={cat.name}
            href={`/categories/${cat.name}`}
            className="group flex flex-col items-center rounded-2xl border border-slate-100 p-3 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <p className="text-xs font-medium text-slate-800 text-center">{cat.name}</p>
            <p className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {cat.count} Items
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Categories