import { FiTruck, FiClock, FiMapPin, FiDollarSign } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const rates = [
  { icon: FiMapPin, label: 'Inside Dhaka', charge: '৳60', time: '3–5 business days' },
  { icon: FiMapPin, label: 'Outside Dhaka', charge: '৳130', time: '5–7 business days' },
]

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">SUPPORT</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Shipping Information</h1>
          <p className="text-slate-500">Everything you need to know about delivery charges and timelines</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {rates.map(({ icon: Icon, label, charge, time }) => (
            <div key={label} className="rounded-2xl border border-slate-100 p-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <p className="font-semibold text-slate-900 mb-1">{label}</p>
              <p className="text-2xl font-bold text-blue-600 mb-1">{charge}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <FiClock size={13} /> {time}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center gap-4 mb-10">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <FiDollarSign size={20} />
          </div>
          <div>
            <p className="font-semibold">Free Shipping</p>
            <p className="text-sm text-white/80">Orders over ৳2,500 qualify for free delivery, anywhere in Bangladesh.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FiTruck className="text-blue-600" size={18} /> How delivery works
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Once your order is placed, our team confirms it (for Cash on Delivery orders, we'll call you to confirm).
              Your order is then packed and handed over for delivery. You'll receive an email when your order is
              confirmed, and you can track its status anytime from your Account.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 mb-2">Delivery areas</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We currently deliver across Bangladesh. Delivery charges and estimated timelines depend on whether
              your address is inside or outside Dhaka, as shown above.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 mb-2">Payment on delivery</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              You can pay via Cash on Delivery, or pay online in advance through our secure payment gateway
              (SSLCommerz — supporting bKash, Nagad, cards, and internet banking).
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ShippingInfo