import { useEffect, useState } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiHome, FiRefreshCw, FiShoppingBag } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import { formatPrice } from '../utils/productHelpers'

const RESULT_CONFIG = {
    success: {
        icon: FiCheckCircle,
        iconBg: 'from-green-400 to-emerald-600',
        iconShadow: 'shadow-green-200',
        title: 'Payment Successful!',
        subtitle: 'Your payment has been received and your order is confirmed.',
        bannerBg: 'from-blue-50 via-indigo-50 to-purple-50',
    },
    fail: {
        icon: FiXCircle,
        iconBg: 'from-red-400 to-red-600',
        iconShadow: 'shadow-red-200',
        title: 'Payment Failed',
        subtitle: "We couldn't process your payment. No charges were made.",
        bannerBg: 'from-red-50 via-orange-50 to-amber-50',
    },
    cancel: {
        icon: FiAlertTriangle,
        iconBg: 'from-amber-400 to-orange-500',
        iconShadow: 'shadow-amber-200',
        title: 'Payment Cancelled',
        subtitle: 'You cancelled the payment. Your order is still saved.',
        bannerBg: 'from-amber-50 via-orange-50 to-yellow-50',
    },
}

const PaymentResult = ({ type }) => {
    const [searchParams] = useSearchParams()
    const params = useParams()
    const orderId = searchParams.get('order_id') || params.orderId

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [retrying, setRetrying] = useState(false)
    const [retryError, setRetryError] = useState('')

    const config = RESULT_CONFIG[type]
    const Icon = config.icon

    useEffect(() => {
        if (!orderId) {
            setLoading(false)
            return
        }
        api.get(`/shop/orders/${orderId}/`)
            .then((res) => setOrder(res.data))
            .catch(() => setOrder(null))
            .finally(() => setLoading(false))
    }, [orderId])

    const handleRetry = async () => {
        if (!order) return
        setRetrying(true)
        setRetryError('')
        try {
            const method = order.payment?.method || 'card'
            const phone = order.shipping_address?.phone
            const response = await api.post(`/shop/payment/initiate/${order.id}/`, {
                payment_method: method,
                phone_number: phone,
            })
            window.location.href = response.data.payment_url
        } catch (err) {
            setRetryError(err.response?.data?.error || 'Could not retry payment. Please try again.')
        } finally {
            setRetrying(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className={`relative overflow-hidden bg-gradient-to-br ${config.bannerBg} py-16`}>
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_80%_80%,_#9333EA_0%,_transparent_45%)]" />

                <div className="relative max-w-2xl mx-auto px-4 text-center">
                    {loading ? (
                        <p className="text-slate-400">Loading order details...</p>
                    ) : (
                        <>
                            <motion.div
                                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                                className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${config.iconBg} flex items-center justify-center mb-6 shadow-xl ${config.iconShadow}`}
                            >
                                <Icon className="text-white" size={40} />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-3xl font-extrabold text-slate-900 mb-2"
                            >
                                {config.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="text-slate-500 mb-8"
                            >
                                {config.subtitle}
                            </motion.p>

                            {order && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 p-6 text-left mb-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-xs text-slate-400">Order Number</p>
                                            <p className="font-bold text-slate-900">{order.order_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Amount</p>
                                            <p className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {formatPrice(order.total_amount)}
                                            </p>
                                        </div>
                                    </div>

                                    {order.coupon && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium border-t border-slate-100 pt-3 mb-1">
                                            <span>Coupon used — get {Math.round(Number(order.coupon.discount_percent))}% discount</span>
                                            <span>−{formatPrice(order.coupon_discount)}</span>
                                        </div>
                                    )}

                                    {type !== 'success' && (
                                        <div className="border-t border-slate-100 pt-4">
                                            {retryError && (
                                                <p className="text-sm text-red-500 mb-3">{retryError}</p>
                                            )}
                                            <button
                                                onClick={handleRetry}
                                                disabled={retrying}
                                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
                                            >
                                                {retrying ? (
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <FiRefreshCw size={16} />
                                                )}
                                                {retrying ? 'Redirecting...' : 'Try Payment Again'}
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                className="flex items-center justify-center gap-3"
                            >
                                <a
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full font-medium hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                                >
                                    <FiHome size={16} /> Continue Shopping
                                </a>
                                <a
                                    href="/orders"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"
                                >
                                    <FiShoppingBag size={16} /> View My Orders
                                </a>
                            </motion.div>
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default PaymentResult