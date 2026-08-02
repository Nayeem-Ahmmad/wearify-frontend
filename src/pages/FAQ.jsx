import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const faqs = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery (COD) and online payments via SSLCommerz, which supports bKash, Nagad, debit/credit cards, and internet banking.',
  },
  {
    q: 'How much is the delivery charge?',
    a: 'Delivery costs ৳60 inside Dhaka and ৳130 outside Dhaka. Orders above ৳2,500 get free delivery, regardless of location.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are usually delivered within 3-5 business days inside Dhaka, and 5-7 business days outside Dhaka.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Yes, you can cancel your order from your Account page as long as the order status is still "Pending." Once confirmed, cancellation is no longer available through the website.',
  },
  {
    q: 'How do I track my order?',
    a: 'Go to My Account > Order History, or use the "Track Your Order" link in your order confirmation email, to see your order status.',
  },
  {
    q: 'Do you offer returns or exchanges?',
    a: 'Our Easy Returns program is coming soon. For now, if you receive a damaged or incorrect item, please contact our support team and we\'ll help resolve it.',
  },
  {
    q: 'How do I know if a product is on sale?',
    a: 'Discounted products show a crossed-out original price alongside the discounted price and a "-X%" badge. Visit our Deals page to see everything currently on sale.',
  },
  {
    q: 'I forgot to add a discount code / coupon at checkout, can I still apply it?',
    a: 'Coupon codes must be entered on the Checkout page before placing your order. Once an order is placed, coupons applied at that time will be reflected in your order total automatically.',
  },
]

const FAQPage = () => {
  const [open, setOpen] = useState(0)

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
        <div className="relative max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">SUPPORT</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-slate-500">Everything you need to know about shopping with Wearify</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
          {faqs.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors duration-200"
              >
                <span className="font-medium text-slate-800 text-sm">{item.q}</span>
                <FiChevronDown
                  size={16}
                  className={`shrink-0 text-slate-400 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40' : 'max-h-0'}`}>
                <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Still have questions?{' '}
          <a href="/contact" className="text-blue-600 font-medium hover:underline">Contact our support team</a>
        </p>
      </section>

      <Footer />
    </div>
  )
}

export default FAQPage