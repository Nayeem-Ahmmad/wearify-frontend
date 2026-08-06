import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiCheckCircle } from 'react-icons/fi'
import { subscribeNewsletter } from '../api/newsletter'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setLoading(true)
    try {
      await subscribeNewsletter(email)
      setSubscribed(true)
      setEmail('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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

        <AnimatePresence mode="wait">
          {subscribed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center max-w-md mx-auto py-2"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-green-500/30"
              >
                <FiCheckCircle className="text-white" size={30} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white font-semibold text-lg"
              >
                You're subscribed!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-slate-400 text-sm mt-1"
              >
                Keep an eye on your inbox for exclusive offers.
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setSubscribed(false)}
                className="text-xs text-blue-400 hover:text-blue-300 mt-5 hover:underline transition-colors duration-300"
              >
                Subscribe another email
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full sm:flex-1 px-5 py-3 rounded-full text-sm bg-white/10 text-white placeholder-slate-400 border border-white/10 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 shrink-0 disabled:opacity-60 disabled:hover:scale-100"
                >
                  <FiSend size={15} />
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
              <p className="text-xs text-slate-500 mt-4">No spam, unsubscribe anytime.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Newsletter