import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FiCheckCircle, FiPackage, FiHome, FiShoppingBag,
    FiClock, FiTruck, FiXCircle, FiSearch, FiLogIn,
} from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { trackOrder } from '../api/orders'
import { formatPrice } from '../utils/productHelpers'

const STAGES = [
    { key: 'pending', label: 'Order Placed', icon: FiClock },
    { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
    { key: 'processing', label: 'Processing', icon: FiPackage },
    { key: 'shipped', label: 'Shipped', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiHome },
]

const statusToStageIndex = (status) => {
    if (status === 'pending') return 0
    if (status === 'confirmed') return 1
    if (['processing', 'packed'].includes(status)) return 2
    if (['shipped', 'out_for_delivery'].includes(status)) return 3
    if (status === 'delivered') return 4
    return -1
}

const TrackOrder = () => {
    const { authenticated } = useAuth()
    const [orderId, setOrderId] = useState('')
    const [order, setOrder] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTrack = async (e) => {
        e.preventDefault()
        setError('')
        setOrder(null)
        if (!orderId.trim()) return
        setLoading(true)
        try {
            const data = await trackOrder(orderId.trim())
            setOrder(data)
        } catch (err) {
            setError(err.response?.data?.error || 'Order not found')
        } finally {
            setLoading(false)
        }
    }

    const isTerminalNegative = order && ['cancelled', 'returned', 'refunded'].includes(order.status)
    const currentStageIndex = order ? statusToStageIndex(order.status) : -1

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 sm:py-14">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
                <div className="relative max-w-2xl mx-auto px-4 text-center">
                    <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">SUPPORT</span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Track Your Order</h1>
                    <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">Check the live status of any order you've placed with us</p>

                    {!authenticated ? (
                        <>
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-5 sm:mb-6">
                                <FiPackage className="text-blue-500" size={28} />
                            </div>
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Sign in to track your order</h2>
                            <p className="text-xs sm:text-sm text-slate-500 mb-6 px-2">
                                Order tracking is available from your account. Please sign in to view your order status.
                            </p>

                            <a
                                href="/login"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"
                            >
                                <FiLogIn size={16} /> Sign In
                            </a>
                        </>
                    ) : (
                        <>
                            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-2">
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Enter your Order ID (e.g. ORD-000123)"
                                    className="flex-1 min-w-0 px-4 py-2.5 sm:py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 disabled:opacity-50"
                                >
                                    <FiSearch size={16} />
                                    {loading ? 'Searching...' : 'Track'}
                                </button>
                            </form>

                            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                            {/* <a href="/orders" className="text-sm text-blue-600 hover:underline">
                                View all your orders
                            </a> */}
                        </>
                    )}
                </div>
            </section>

            {order && (
                <section className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-6"
                    >
                        <span className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 text-xs sm:text-sm text-slate-500">
                            Order <span className="font-semibold text-slate-900 tracking-wide">{order.order_number}</span>
                        </span>
                    </motion.div>

                    {isTerminalNegative ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-left mb-6"
                        >
                            <FiXCircle className="text-red-500 shrink-0" size={22} />
                            <p className="text-sm text-red-700">
                                This order has been {order.status === 'cancelled' ? 'cancelled' : order.status}.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 p-5 sm:p-7 mb-6"
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-400 uppercase">Order Progress</p>
                                <span className="text-[11px] sm:text-xs font-medium text-slate-400">
                                    Step {Math.max(currentStageIndex + 1, 1)} of {STAGES.length}
                                </span>
                            </div>

                            <div className="relative h-[380px] sm:h-[440px]">
                                <svg
                                    className="absolute inset-0 w-full h-full"
                                    viewBox={`0 0 100 ${STAGES.length * 100}`}
                                    preserveAspectRatio="none"
                                    fill="none"
                                >
                                    <defs>
                                        <linearGradient id="snakeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10B981" />
                                            <stop offset="100%" stopColor="#059669" />
                                        </linearGradient>
                                    </defs>
                                    {STAGES.slice(0, -1).map((_, idx) => {
                                        const x1 = idx % 2 === 0 ? 18 : 82
                                        const x2 = (idx + 1) % 2 === 0 ? 18 : 82
                                        const y1 = idx * 100 + 50
                                        const y2 = (idx + 1) * 100 + 50
                                        const midY = (y1 + y2) / 2
                                        const isDone = idx < currentStageIndex
                                        return (
                                            <path
                                                key={idx}
                                                d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                                                stroke={isDone ? 'url(#snakeGradient)' : '#fca5a5'}
                                                strokeWidth={isDone ? '3' : '2'}
                                                strokeDasharray={isDone ? '0' : '1.5 4'}
                                                strokeLinecap="round"
                                                className="transition-all duration-700"
                                            />
                                        )
                                    })}
                                </svg>

                                {STAGES.map((stage, idx) => {
                                    const isOrderDelivered = currentStageIndex === STAGES.length - 1
                                    const isCompleted = idx < currentStageIndex || (isOrderDelivered && idx === currentStageIndex)
                                    const isCurrent = idx === currentStageIndex && !isOrderDelivered
                                    const isReached = idx <= currentStageIndex
                                    const Icon = stage.icon
                                    const isLeft = idx % 2 === 0
                                    const topPercent = ((idx * 100 + 50) / (STAGES.length * 100)) * 100
                                    return (
                                        <div
                                            key={stage.key}
                                            className={`absolute flex items-center ${isLeft ? 'left-[5%] sm:left-[8%] flex-row' : 'right-[5%] sm:right-[8%] flex-row-reverse'}`}
                                            style={{ top: `${topPercent}%`, transform: 'translateY(-50%)' }}
                                        >
                                            <div
                                                className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center ring-[5px] ring-white transition-all duration-300 ${isReached
                                                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200/70'
                                                    : 'bg-red-50 text-red-400'
                                                    }`}
                                            >
                                                {isCurrent && (
                                                    <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-25 animate-ping" />
                                                )}
                                                {isCompleted ? (
                                                    <FiCheckCircle size={18} className="relative sm:hidden" />
                                                ) : (
                                                    <Icon size={17} className="relative sm:hidden" />
                                                )}
                                                {isCompleted ? (
                                                    <FiCheckCircle size={22} className="relative hidden sm:block" />
                                                ) : (
                                                    <Icon size={20} className="relative hidden sm:block" />
                                                )}
                                            </div>

                                            <div className={`z-10 ml-3 sm:ml-4 mr-3 sm:mr-4 max-w-[112px] sm:max-w-[150px] ${isLeft ? 'text-left' : 'text-right'}`}>
                                                <p className={`text-[11px] sm:text-sm font-semibold tracking-wide leading-tight ${isReached ? 'text-green-700' : 'text-red-500'}`}>
                                                    {stage.label}
                                                </p>
                                                {isCurrent && (
                                                    <span className={`inline-flex items-center gap-1.5 mt-1 text-[9px] sm:text-[11px] font-medium text-emerald-600 ${isLeft ? '' : 'flex-row-reverse'}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 p-4 sm:p-6 text-left mb-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <FiPackage size={15} />
                            </div>
                            <h2 className="font-semibold text-slate-900 text-sm sm:text-base">Order Summary</h2>
                        </div>
                        <div className="space-y-2.5 text-xs sm:text-sm mb-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-3 flex-wrap">
                                    <span className="text-slate-600">
                                        {item.variant.product_name}
                                        <span className="text-slate-400"> ({item.variant.size}/{item.variant.color}) x{item.quantity}</span>
                                    </span>
                                    <span className="font-medium text-slate-800 shrink-0">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        {Number(order.shipping_cost) > 0 && (
                            <div className="flex justify-between text-xs sm:text-sm text-slate-500 mb-2">
                                <span>Shipping</span>
                                <span>{formatPrice(order.shipping_cost)}</span>
                            </div>
                        )}
                        <div className="border-t border-slate-100 pt-4 space-y-2">
                            {order.coupon && (
                                <div className="flex justify-between gap-3 flex-wrap text-xs sm:text-sm text-green-600 font-medium">
                                    <span>Coupon used — get {Math.round(Number(order.coupon.discount_percent))}% discount</span>
                                    <span className="shrink-0">−{formatPrice(order.coupon_discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-slate-900 text-sm sm:text-base">Total</span>
                                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {formatPrice(order.total_amount)}
                                </span>
                            </div>
                        </div>

                        {order.shipping_address && (
                            <div className="border-t border-slate-100 mt-4 pt-4 text-xs sm:text-sm text-slate-600">
                                <p className="font-medium text-slate-800">{order.shipping_address.full_name} — {order.shipping_address.phone}</p>
                                <p>{order.shipping_address.full_address}</p>
                            </div>
                        )}
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                        <a
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all duration-300"
                        >
                            <FiHome size={16} /> Continue Shopping
                        </a>

                        <a
                            href="/orders"
                            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                        >
                            <FiShoppingBag size={16} /> View My Orders
                        </a>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    )
}

export default TrackOrder