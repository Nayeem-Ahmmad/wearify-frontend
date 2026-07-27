import { useState } from 'react'
import { FiMail, FiCheck } from 'react-icons/fi'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <section className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <FiMail size={28} />
          <div>
            <p className="font-semibold">Subscribe to our Newsletter</p>
            <p className="text-sm text-blue-100">Get the latest updates on new arrivals and exclusive offers</p>
          </div>
        </div>

        <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 md:w-72 px-4 py-2.5 rounded-full text-sm outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          />
          <button
            type="submit"
            className="bg-slate-950 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all duration-300 flex items-center gap-1.5"
          >
            {subscribed ? <FiCheck className="animate-bounce" /> : null}
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter