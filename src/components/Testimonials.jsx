import { useEffect, useState } from 'react'
import { FiStar } from 'react-icons/fi'

const reviews = [
  { name: 'Rafiq Hasan', text: 'Amazing quality and fast delivery. Absolutely love shopping from Wearify!', rating: 5, avatar: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Sadia Afrin', text: 'Great collection and reasonable prices. Highly recommended!', rating: 5, avatar: 'https://i.pravatar.cc/100?img=47' },
  { name: 'Nayeem Islam', text: 'Best customer support and smooth shopping experience.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=33' },
]

const Testimonials = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % reviews.length), 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">What Our Customers Say</h2>

      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <div
            key={r.name}
            className={`p-5 rounded-2xl border transition-all duration-500 ${
              i === index ? 'border-blue-200 shadow-lg scale-[1.02]' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={r.avatar}
                alt={r.name}
                className="w-11 h-11 rounded-full object-cover hover:scale-110 transition-transform duration-300"
              />
              <div>
                <p className="font-medium text-sm text-slate-800">{r.name}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <FiStar key={idx} size={12} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials