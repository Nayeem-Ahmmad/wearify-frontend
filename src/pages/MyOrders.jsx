import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPackage, FiChevronRight, FiXCircle, FiClock, FiShoppingBag } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import { formatPrice, getProductImage } from '../utils/productHelpers'
import { useToast } from '../components/Toast'

const STATUS_META = {
    pending: { badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'from-amber-400 to-amber-500', dot: 'bg-amber-400' },
    confirmed: { badge: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'from-blue-500 to-blue-600', dot: 'bg-blue-500' },
    processing: { badge: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'from-blue-500 to-blue-600', dot: 'bg-blue-500' },
    packed: { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', bar: 'from-indigo-500 to-indigo-600', dot: 'bg-indigo-500' },
    shipped: { badge: 'bg-purple-50 text-purple-700 border-purple-200', bar: 'from-purple-500 to-purple-600', dot: 'bg-purple-500' },
    out_for_delivery: { badge: 'bg-purple-50 text-purple-700 border-purple-200', bar: 'from-purple-500 to-purple-600', dot: 'bg-purple-500' },
    delivered: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'from-emerald-500 to-emerald-600', dot: 'bg-emerald-500' },
    paid: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'from-emerald-500 to-emerald-600', dot: 'bg-emerald-500' },
    cancelled: { badge: 'bg-red-50 text-red-700 border-red-200', bar: 'from-red-500 to-red-600', dot: 'bg-red-500' },
    returned: { badge: 'bg-red-50 text-red-700 border-red-200', bar: 'from-red-500 to-red-600', dot: 'bg-red-500' },
    refunded: { badge: 'bg-red-50 text-red-700 border-red-200', bar: 'from-red-500 to-red-600', dot: 'bg-red-500' },
}

const formatStatus = (status) => status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const MyOrders = () => {
    const { showToast } = useToast()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)

    const loadOrders = () => {
        setLoading(true)
        api.get('/shop/orders/')
            .then((res) => setOrders(res.data.results || res.data))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadOrders()
    }, [])

    const handleCancel = async (orderId) => {
        setCancellingId(orderId)
        try {
            await api.post(`/shop/orders/${orderId}/cancel/`)
            showToast('Order cancelled')
            loadOrders()
        } catch (err) {
            showToast(err.response?.data?.error || 'Could not cancel this order')
        } finally {
            setCancellingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
                <div className="relative max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">
                            YOUR ORDER HISTORY
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">My Orders</h1>
                        <p className="text-slate-500">Track, review and manage everything you've ordered from Wearify</p>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 py-10 -mt-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                                <div className="h-1.5 bg-slate-100 animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                                    <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white"
                    >
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-5">
                            <FiPackage className="text-blue-500" size={32} />
                        </div>
                        <p className="text-slate-700 font-semibold text-lg">No orders yet</p>
                        <p className="text-sm text-slate-400 mt-1 mb-6">Your orders will show up here once you place one</p>
                        <a
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"
                        >
                            <FiShoppingBag size={15} /> Start Shopping
                        </a>
                    </motion.div>
                ) : (
                    <div className="space-y-5">
                        <AnimatePresence>
                            {orders.map((order, idx) => {
                                const canCancel = !['delivered', 'shipped', 'cancelled', 'returned', 'refunded'].includes(order.status)
                                const meta = STATUS_META[order.status] || { badge: 'bg-slate-50 text-slate-600 border-slate-200', bar: 'from-slate-400 to-slate-500', dot: 'bg-slate-400' }
                                const previewImages = order.items.slice(0, 4)

                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: idx * 0.08, type: 'spring', stiffness: 120, damping: 18 }}
                                        className="rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                    >
                                        <div className={`h-1.5 bg-gradient-to-r ${meta.bar}`} />

                                        <div className="p-5 md:p-6">
                                            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                                <div>
                                                    <p className="font-bold text-slate-900 text-lg">{order.order_number}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                        <FiClock size={11} />
                                                        {new Date(order.created_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${meta.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} animate-pulse`} />
                                                    {formatStatus(order.status)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex -space-x-3">
                                                    {previewImages.map((item, i) => (
                                                        <div
                                                            key={item.id}
                                                            className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white bg-slate-100 shadow-sm"
                                                            style={{ zIndex: previewImages.length - i }}
                                                        >
                                                            <img
                                                                src={item.variant.product_image || getProductImage({ images: [] })}
                                                                alt={item.variant.product_name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    {order.items.length > 4 && (
                                                        <div className="w-12 h-12 rounded-xl border-2 border-white bg-slate-800 text-white text-xs font-semibold flex items-center justify-center shadow-sm">
                                                            +{order.items.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                    {formatPrice(order.total_amount)}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    {canCancel && (
                                                        <button
                                                            onClick={() => handleCancel(order.id)}
                                                            disabled={cancellingId === order.id}
                                                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 hover:underline disabled:opacity-50 transition-colors duration-300"
                                                        >
                                                            <FiXCircle size={13} />
                                                            {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                                        </button>
                                                    )}
                                                    <a
                                                        href={`/order-confirmation?order_id=${order.id}`}
                                                        className="group flex items-center gap-1 text-sm text-blue-600 font-semibold"
                                                    >
                                                        View Details
                                                        <FiChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )
                }
            </section >

            <Footer />
        </div >
    )
}

export default MyOrders