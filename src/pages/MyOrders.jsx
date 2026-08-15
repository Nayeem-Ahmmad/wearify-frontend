import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPackage, FiChevronRight, FiXCircle, FiClock, FiShoppingBag, FiDownload, FiRotateCcw } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import { downloadInvoice, requestReturn } from '../api/orders'
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

const RETURN_STATUS_META = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
}

const formatStatus = (status) => status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const MyOrders = () => {
    const { showToast } = useToast()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)
    const [downloadingId, setDownloadingId] = useState(null)
    const [returnOrder, setReturnOrder] = useState(null)
    const [returnReason, setReturnReason] = useState('')
    const [submittingReturn, setSubmittingReturn] = useState(false)

    const handleDownloadInvoice = async (order) => {
        setDownloadingId(order.id)
        try {
            await downloadInvoice(order.id, order.order_number)
        } catch {
            showToast('Could not download invoice')
        } finally {
            setDownloadingId(null)
        }
    }

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

    const handleSubmitReturn = async () => {
        if (!returnOrder || !returnReason.trim()) return
        setSubmittingReturn(true)
        try {
            await requestReturn(returnOrder.id, returnReason.trim())
            showToast('Return request submitted')
            setReturnOrder(null)
            setReturnReason('')
            loadOrders()
        } catch (err) {
            showToast(err.response?.data?.error || 'Could not submit return request')
        } finally {
            setSubmittingReturn(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
                <div className="relative max-w-6xl mx-auto px-4">
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

            <section className="max-w-6xl mx-auto px-4 py-10 -mt-6">
                {loading ? (
                    <div className="grid md:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-40 rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
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
                    <div className="grid md:grid-cols-2 gap-5">
                        <AnimatePresence>
                            {orders.map((order, idx) => {
                                const canCancel = !['delivered', 'shipped', 'cancelled', 'returned', 'refunded'].includes(order.status)
                                const canRequestReturn = order.status === 'delivered' && !order.return_request
                                const meta = STATUS_META[order.status] || { badge: 'bg-slate-50 text-slate-600 border-slate-200', bar: 'from-slate-400 to-slate-500', dot: 'bg-slate-400' }
                                const previewImages = order.items.slice(0, 4)

                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: idx * 0.08, type: 'spring', stiffness: 120, damping: 18 }}
                                        className="rounded-3xl border border-slate-100 bg-white shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                    >
                                        <div className={`h-1.5 bg-gradient-to-r ${meta.bar}`} />

                                        <div className="p-5 md:p-6">
                                            <div className="flex items-start justify-between flex-wrap gap-3 pb-4 mb-4 border-b border-slate-100">
                                                <div>
                                                    <p className="font-bold text-slate-900 text-lg leading-tight">{order.order_number}</p>
                                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                                        <FiClock size={11} />
                                                        {new Date(order.created_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        <span className="text-slate-300">•</span>
                                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0 ${meta.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} animate-pulse`} />
                                                    {formatStatus(order.status)}
                                                </span>
                                            </div>

                                            {order.return_request && (
                                                <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border mb-4 w-fit ${RETURN_STATUS_META[order.return_request.status]}`}>
                                                    <FiRotateCcw size={12} />
                                                    Return {formatStatus(order.return_request.status)}
                                                </div>
                                            )}

                                            <div className="flex gap-3 overflow-x-auto pb-1 mb-5 -mx-1 px-1 [&::-webkit-scrollbar]:hidden">
                                                {previewImages.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex flex-col gap-1.5 shrink-0 w-[76px]"
                                                    >
                                                        <div className="w-[76px] h-[76px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                                                            <img
                                                                src={item.variant?.product_image || getProductImage({ images: [] })}
                                                                alt={item.variant?.product_name || 'Product'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                                                            {item.variant?.product_name || 'Product'}
                                                        </p>
                                                    </div>
                                                ))}
                                                {order.items.length > 4 && (
                                                    <div className="flex flex-col gap-1.5 shrink-0 w-[76px]">
                                                        <div className="w-[76px] h-[76px] rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs font-semibold flex items-center justify-center">
                                                            +{order.items.length - 4}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 leading-tight">more items</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-slate-100">
                                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl px-4 py-2.5">
                                                    <p className="text-[10px] font-semibold text-slate-400 tracking-wide mb-0.5">TOTAL PAID</p>
                                                    <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        {formatPrice(order.total_amount)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {canCancel && (
                                                        <button
                                                            onClick={() => handleCancel(order.id)}
                                                            disabled={cancellingId === order.id}
                                                            title="Cancel Order"
                                                            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors duration-300 px-3 py-2 rounded-full"
                                                        >
                                                            <FiXCircle size={13} />
                                                            {cancellingId === order.id ? 'Cancelling...' : 'Cancel'}
                                                        </button>
                                                    )}
                                                    {canRequestReturn && (
                                                        <button
                                                            onClick={() => setReturnOrder(order)}
                                                            title="Request Return"
                                                            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 px-3 py-2 rounded-full"
                                                        >
                                                            <FiRotateCcw size={13} /> Return
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDownloadInvoice(order)}
                                                        disabled={downloadingId === order.id}
                                                        title="Download Invoice"
                                                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors duration-300 px-3 py-2 rounded-full"
                                                    >
                                                        <FiDownload size={13} />
                                                        {downloadingId === order.id ? 'Downloading...' : 'Invoice'}
                                                    </button>
                                                    <a
                                                        href={`/order-confirmation?order_id=${order.id}`}
                                                        className="group flex items-center gap-1 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm"
                                                    >
                                                        View Details
                                                        <FiChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
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

            {returnOrder && (
                <div
                    className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => { setReturnOrder(null); setReturnReason('') }}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-4">
                            <FiRotateCcw className="text-orange-500" size={22} />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-center mb-1">Request Return</h3>
                        <p className="text-sm text-slate-500 text-center mb-4">
                            Order <span className="font-medium text-slate-700">{returnOrder.order_number}</span>
                        </p>
                        <textarea
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            placeholder="Tell us why you'd like to return this order..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none mb-4"
                        />
                        <button
                            onClick={handleSubmitReturn}
                            disabled={submittingReturn || !returnReason.trim()}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 disabled:opacity-60"
                        >
                            {submittingReturn ? 'Submitting...' : 'Submit Return Request'}
                        </button>
                        <button
                            onClick={() => { setReturnOrder(null); setReturnReason('') }}
                            className="w-full mt-2 text-sm text-slate-400 hover:text-slate-600 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div >
    )
}

export default MyOrders