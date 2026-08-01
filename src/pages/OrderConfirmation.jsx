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

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
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
    api.get(`/shop/orders/${orderId}/`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Could not load your order details'))
      .finally(() => setLoading(false))
  }, [orderId])

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
                  className="rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 p-6 mb-6"
                >
                  <div className="flex items-center">
                    {STAGES.map((stage, idx) => {
                      const reached = idx <= currentStageIndex
                      const Icon = stage.icon
                      return (
                        <div key={stage.key} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center shrink-0">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${reached
                                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md shadow-blue-200'
                                  : 'bg-slate-100 text-slate-400'
                                }`}
                            >
                              <Icon size={15} />
                            </div>
                            <span className={`mt-1.5 text-[10px] text-center leading-tight ${reached ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                              {stage.label}
                            </span>
                          </div>
                          {idx < STAGES.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 mb-4 transition-colors duration-500 ${idx < currentStageIndex ? 'bg-blue-600' : 'bg-slate-200'}`} />
                          )}
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
                <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>

                {order.shipping_address && (
                  <div className="border-t border-slate-100 mt-4 pt-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">{order.shipping_address.full_name} — {order.shipping_address.phone}</p>
                    <p>{order.shipping_address.full_address}</p>
                  </div>
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex items-center justify-center gap-3"
              >
                <a
                  href="/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all duration-300"
                >
                  <FiHome size={16} /> Continue Shopping
                </a>

                <a
                  href="/orders"
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full font-medium hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
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

export default OrderConfirmation