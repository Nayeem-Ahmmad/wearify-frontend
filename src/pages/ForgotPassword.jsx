import { useState } from 'react'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import { requestPasswordReset } from '../api/auth'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                <FiCheckCircle className="text-green-500" size={28} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Check your email</h1>
              <p className="text-sm text-slate-500">
                If an account exists for <span className="font-medium text-slate-700">{email}</span>, we've sent a password reset link.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Forgot Password?</h1>
              <p className="text-sm text-slate-500 text-center mb-8">
                Enter your email and we'll send you a reset link
              </p>

              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <a href="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 mt-6 transition-colors duration-300">
            <FiArrowLeft size={14} /> Back to Sign In
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ForgotPassword