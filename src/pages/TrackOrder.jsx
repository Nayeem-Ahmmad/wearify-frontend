import { FiPackage, FiLogIn } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

const TrackOrder = () => {
    const { authenticated } = useAuth()

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
                <div className="relative max-w-3xl mx-auto px-4 text-center">
                    <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">SUPPORT</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Track Your Order</h1>
                    <p className="text-slate-500">Check the live status of any order you've placed with us</p>
                </div>
            </section>

            <section className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6">
                    <FiPackage className="text-blue-500" size={32} />
                </div>

                {authenticated ? (
                    <>
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">View all your orders</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Your order history, live status, and tracking details are all available on your Account page.
                        </p>
                        <a
                            href="/orders"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"
                        >
                            Go to My Orders
                        </a>
                    </>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Sign in to track your order</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Order tracking is available from your account. Please sign in to view your order status.
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"
                        >
                            <FiLogIn size={16} /> Sign In
                        </a>
                    </>
                )}

                <p className="text-xs text-slate-400 mt-8">
                    You'll also receive a tracking link in your order confirmation email once your order is placed.
                </p>
            </section>

            <Footer />
        </div>
    )
}

export default TrackOrder