import { FiPhone, FiMail, FiMessageCircle, FiPackage, FiCreditCard, FiHelpCircle } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const topics = [
    { icon: FiPackage, title: 'Orders & Delivery', desc: 'Track orders, delivery charges, and delivery time.', href: '/faq' },
    { icon: FiCreditCard, title: 'Payments', desc: 'COD, bKash, Nagad, and card payments via SSLCommerz.', href: '/faq' },
    { icon: FiHelpCircle, title: 'Account & Wishlist', desc: 'Manage your profile, addresses, and saved items.', href: '/account' },
]

const Help = () => {
    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">SUPPORT</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Help Center</h1>
                    <p className="text-slate-500">We're here to help — find answers or reach out directly</p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid sm:grid-cols-3 gap-4 mb-12">
                    {topics.map(({ icon: Icon, title, desc, href }) => (
                        <a
                            key={title}
                            href={href}
                            className="flex flex-col items-center text-center gap-2 rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Icon size={20} />
                            </div>
                            <p className="font-medium text-slate-800 text-sm">{title}</p>
                            <p className="text-xs text-slate-400">{desc}</p>
                        </a>
                    ))}
                </div>

                <div className="rounded-2xl border border-slate-100 p-8 text-center">
                    <h2 className="font-bold text-slate-900 mb-2">Still need help?</h2>
                    <p className="text-sm text-slate-500 mb-6">Our team usually responds within a few hours</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:wearify.sells@gmail.com" className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 transition-colors duration-300">
                            <FiMail size={16} /> wearify.sells@gmail.com
                        </a>
                        <a href="tel:+8801581270371" className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 transition-colors duration-300">
                            <FiPhone size={16} /> +880 1581-270371
                        </a>
                        <a href="/contact" className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline">
                            <FiMessageCircle size={16} /> Contact Form
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Help