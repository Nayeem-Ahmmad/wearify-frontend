import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiCheckCircle, FiPackage, FiPhoneCall, FiHome, FiShoppingBag,
  FiClock, FiTruck, FiXCircle,
} from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
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

const paymentMethodLabel = (method) => {
  if (method === 'cod') return 'Cash on Delivery'
  if (method === 'card') return 'Card'
  if (method === 'bkash') return 'bKash'
  if (method === 'nagad') return 'Nagad'
  return method
}

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) {
      setError('No order found')
      setLoading(false)
      return
    }
    const url = token
      ? `/shop/orders/${orderId}/?token=${token}`
      : `/shop/orders/${orderId}/`
    api.get(url)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Could not load your order details'))
      .finally(() => setLoading(false))
  }, [orderId, token])

  const isTerminalNegative = order && ['cancelled', 'returned', 'refunded'].includes(order.status)
  const currentStageIndex = order ? statusToStageIndex(order.status) : -1

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_80%_80%,_#9333EA_0%,_transparent_45%)]" />

        <div className="relative max-w-2xl mx-auto px-4 text-center">
          {loading ? (
            <p className="text-slate-400">Loading your order...</p>
          ) : error ? (
            <div>
              <p className="text-slate-700 font-medium mb-2">{error}</p>
              <button onClick={() => navigate('/')} className="text-blue-600 hover:underline text-sm">
                Go back home
              </button>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-green-200"
              >
                <FiCheckCircle className="text-white" size={40} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-3xl font-extrabold text-slate-900 mb-2"
              >
                Order Placed Successfully!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-slate-500 mb-8"
              >
                Order <span className="font-semibold text-blue-600">{order.order_number}</span> has been received
              </motion.p>

              {isTerminalNegative ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
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
                  transition={{ delay: 0.3 }}
                  className="rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 p-5 sm:p-7 mb-6 text-left"
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
                        <linearGradient id="snakeGradientConfirm" x1="0" y1="0" x2="0" y2="1">
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
                            stroke={isDone ? 'url(#snakeGradientConfirm)' : '#fca5a5'}
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
                              <span className="inline-flex items-center gap-1.5 mt-1 text-[9px] sm:text-[11px] font-medium text-emerald-600">
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
                transition={{ delay: 0.35 }}
                className="rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 p-6 text-left mb-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FiPackage size={15} />
                  </div>
                  <h2 className="font-semibold text-slate-900">Order Summary</h2>
                </div>
                <div className="space-y-2.5 text-sm mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-slate-600">
                        {item.variant.product_name}
                        <span className="text-slate-400"> ({item.variant.size}/{item.variant.color}) x{item.quantity}</span>
                      </span>
                      <span className="font-medium text-slate-800">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {Number(order.shipping_cost) > 0 && (
                  <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shipping_cost)}</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  {order.coupon && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Coupon used — get {Math.round(Number(order.coupon.discount_percent))}% discount</span>
                      <span>−{formatPrice(order.coupon_discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Payment method + status */}
                {order.payment && (
                  <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Payment Method:{' '}
                      <span className="font-medium text-slate-700">
                        {paymentMethodLabel(order.payment.method)}
                      </span>
                    </span>

                    {order.payment.method === 'cod' ? (
                      <span className="font-medium px-2.5 py-1 rounded-full text-xs bg-amber-50 text-amber-600">
                        Pay on Delivery
                      </span>
                    ) : (
                      <span
                        className={`font-medium px-2.5 py-1 rounded-full text-xs ${
                          order.payment.status === 'paid'
                            ? 'bg-green-50 text-green-600'
                            : order.payment.status === 'failed'
                            ? 'bg-red-50 text-red-600'
                            : order.payment.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {order.payment.status === 'paid' ? 'Paid ✓' : order.payment.status}
                      </span>
                    )}
                  </div>
                )}

                {order.shipping_address && (
                  <div className="border-t border-slate-100 mt-4 pt-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">{order.shipping_address.full_name} — {order.shipping_address.phone}</p>
                    <p>{order.shipping_address.full_address}</p>
                  </div>
                )}

                {order.payment?.transaction_id && (
                  <p className="text-xs text-slate-400 mt-3">
                    Transaction ID: {order.payment.transaction_id}
                  </p>
                )}
              </motion.div>

              {order.status === 'pending' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-left mb-8 shadow-lg shadow-blue-200"
                >
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <FiPhoneCall className="text-white" size={16} />
                  </div>
                  <p className="text-sm text-white">
                    Our team will call you shortly at <span className="font-semibold">{order.shipping_address?.phone}</span> to confirm your order.
                  </p>
                </motion.div>
              )}

              {order.status === 'confirmed' && order.payment?.status === 'paid' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-100 p-4 text-left mb-8"
                >
                  <FiCheckCircle className="text-green-600 shrink-0" size={20} />
                  <p className="text-sm text-green-700">
                    Payment received successfully! Your order is confirmed and being prepared.
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex items-stretch justify-center gap-3"
              >
                <a
                  href="/"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-300 transition-all duration-300"
                >
                  <FiHome size={15} /> Continue Shopping
                </a>

                <a
                  href="/orders"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                >
                  <FiShoppingBag size={15} /> View My Orders
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

export default OrderConfirmation