import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
  {
    title: '1. About Wearify',
    content: 'Wearify is an online clothing and accessories store based in Gulshan, Dhaka, Bangladesh. By placing an order or creating an account on our website, you agree to the terms outlined on this page.',
  },
  {
    title: '2. Orders & Payment',
    content: 'You can pay for your order via Cash on Delivery (COD) or online payment through our secure payment gateway (SSLCommerz — supporting bKash, Nagad, cards, and internet banking). Orders placed via COD remain "Pending" until our team calls to confirm the order. Orders paid online are processed immediately without requiring a confirmation call.',
  },
  {
    title: '3. Pricing & Shipping Charges',
    content: 'All prices are listed in Bangladeshi Taka (BDT) and are inclusive of applicable taxes unless stated otherwise. A delivery charge of ৳60 applies for addresses inside Dhaka, and ৳130 for addresses outside Dhaka. Orders above ৳2,500 qualify for free shipping.',
  },
  {
    title: '4. Order Cancellation',
    content: 'Orders can be cancelled directly from your account while the order status is "Pending." Once an order has been confirmed by our team, it can no longer be cancelled through the website — please contact our support team if you need help with a confirmed order.',
  },
  {
    title: '5. Product Information',
    content: 'We make every effort to display product colors, sizes, and details as accurately as possible. Slight variations in color may occur due to screen display settings or manufacturing batches.',
  },
  {
    title: '6. Account Responsibility',
    content: 'You are responsible for maintaining the confidentiality of your account login details and for all activities that occur under your account.',
  },
  {
    title: '7. Changes to These Terms',
    content: 'We may update these Terms of Service from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.',
  },
  {
    title: '8. Contact Us',
    content: 'For any questions about these terms, reach out to us at wearify.sells@gmail.com or +880 1581-270371.',
  },
]

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
        <div className="relative max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">LEGAL</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-500">Last updated: August 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-bold text-slate-900 mb-2">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{s.content}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  )
}

export default Terms