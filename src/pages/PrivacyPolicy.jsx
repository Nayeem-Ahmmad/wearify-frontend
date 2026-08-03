import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
    {
        title: '1. Information We Collect',
        content: 'When you create an account or place an order, we collect information such as your name, phone number, email address, shipping address, and order details. We do not store your full payment card information — online payments are processed securely through SSLCommerz.',
    },
    {
        title: '2. How We Use Your Information',
        content: 'We use your information to process and deliver your orders, send order confirmation and shipping updates, respond to your support requests, and improve our website and services.',
    },
    {
        title: '3. Order & Delivery Communication',
        content: "We use your phone number and email to confirm your order (especially for Cash on Delivery orders) and to send you order status updates, including confirmation, shipment, and delivery notifications.",
    },
    {
        title: '4. Data Sharing',
        content: 'We do not sell or rent your personal information to third parties. Your information is only shared with trusted service providers necessary to fulfill your order, such as our payment gateway (SSLCommerz) and delivery partners.',
    },
    {
        title: '5. Cookies',
        content: 'Our website may use basic cookies and browser storage to keep you logged in and remember your cart contents between visits.',
    },
    {
        title: '6. Your Choices',
        content: 'You can view and update your personal information (name, phone, profile picture, addresses) anytime from your Account page. You may also contact us to request that your data be updated or removed.',
    },
    {
        title: '7. Data Security',
        content: 'We take reasonable measures to protect your personal information from unauthorized access, alteration, or disclosure.',
    },
    {
        title: '8. Contact Us',
        content: 'If you have any questions about how we handle your data, contact us at wearify.sells@gmail.com or +880 1581-270371.',
    },
]

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
                <div className="relative max-w-3xl mx-auto px-4">
                    <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">LEGAL</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
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

export default PrivacyPolicy