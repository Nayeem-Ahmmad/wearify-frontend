import { useState } from 'react'
import { FiSend, FiCheck } from 'react-icons/fi'

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
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,_#2563EB_0%,_transparent_50%),radial-gradient(circle_at_80%_50%,_#9333EA_0%,_transparent_50%)]" />

      <div className="relative max-w-4xl mx-auto px-4 py-14 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 mb-3">
          STAY IN THE LOOP
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Get Exclusive Offers &amp; New Arrivals
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Subscribe to our newsletter and be the first to know about new drops and special discounts.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full sm:flex-1 px-5 py-3 rounded-full text-sm bg-white/10 text-white placeholder-slate-400 border border-white/10 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
          />
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 shrink-0"
          >
            {subscribed ? <FiCheck className="animate-bounce" /> : <FiSend size={15} />}
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">No spam, unsubscribe anytime.</p>
      </div>
    </section>
  )
}

export default Newsletter