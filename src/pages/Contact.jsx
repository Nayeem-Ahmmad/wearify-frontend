import { useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi'
import { sendContactMessage } from '../api/contact'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await sendContactMessage(form.name, form.email, form.message)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 3000)
    } catch {
      setError('Could not send your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Contact Us</h1>
          <p className="text-slate-500">We would love to hear from you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FiMapPin size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Our Location</p>
                <p className="text-sm text-slate-500">Gulshan, Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FiPhone size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Call Us</p>
                <a href="tel:+8801581270371" className="text-sm text-slate-500 hover:text-blue-600 transition-colors duration-300">
                  +880 1581-270371
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FiMail size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Email Us</p>
                <a href="mailto:wearify.sells@gmail.com" className="text-sm text-slate-500 hover:text-blue-600 transition-colors duration-300">
                  wearify.sells@gmail.com
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60"
            >
              {sent ? 'Message Sent!' : sending ? 'Sending...' : (<><FiSend size={16} /> Send Message</>)}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact