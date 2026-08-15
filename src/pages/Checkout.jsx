import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FiMapPin, FiCreditCard, FiCheckCircle, FiShoppingBag,
  FiTruck, FiShield, FiRotateCcw, FiAward, FiPlus, FiUser, FiPhone,
} from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { getAddresses, createAddress } from '../api/addresses'
import { createOrder, initiatePayment } from '../api/orders'
import { formatPrice } from '../utils/productHelpers'
import { useAuth } from '../context/AuthContext'

const STEPS = [
  { label: 'Cart', icon: FiShoppingBag },
  { label: 'Checkout', icon: FiMapPin },
  { label: 'Payment', icon: FiCreditCard },
  { label: 'Confirmation', icon: FiCheckCircle },
]

const PAYMENT_OPTIONS = [
  { value: 'cod', label: 'Cash on Delivery', hint: 'Pay when your order arrives', accent: 'text-slate-700' },
  // { value: 'bkash', label: 'bKash', hint: 'Pay securely via bKash', accent: 'text-pink-600' },
  // { value: 'nagad', label: 'Nagad', hint: 'Pay securely via Nagad', accent: 'text-orange-600' },
  { value: 'card', label: 'Card / SSLCommerz', hint: 'Debit, credit or online banking', accent: 'text-blue-600' },
]

const Checkout = () => {
  const { cart, fetchCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const buyNowItemIds = location.state?.buyNowItemIds || null
  const checkoutItems = buyNowItemIds ? cart.items.filter((i) => buyNowItemIds.includes(i.id)) : cart.items
  const checkoutTotal = buyNowItemIds
    ? checkoutItems.reduce((sum, i) => sum + i.subtotal, 0)
    : cart.total

  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    full_address: '',
    is_default: false,
  })
  const [deliveryLocation, setDeliveryLocation] = useState('inside_dhaka')
  const shippingCost = checkoutTotal > 2500 ? 0 : (deliveryLocation === 'inside_dhaka' ? 60 : 130)
  const grandTotal = checkoutTotal + shippingCost
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [lastOrderId, setLastOrderId] = useState(null)

  useEffect(() => {
    getAddresses()
      .then((data) => {
        setAddresses(data)
        const defaultAddress = data.find((a) => a.is_default) || data[0]
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        } else {
          setShowNewAddressForm(true)
        }
      })
      .catch(() => setShowNewAddressForm(true))
  }, [])

  useEffect(() => {
    if (user) {
      setNewAddress((prev) => ({
        ...prev,
        full_name: prev.full_name || user.user?.username || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

  const triggerError = (message) => {
    setError(message)
    showToast(message)
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({ ...prev, [name]: value }))
  }

  const resolveAddress = async () => {
    if (showNewAddressForm) {
      if (!newAddress.full_name || !newAddress.phone || !newAddress.full_address) {
        throw new Error('Please fill in all address fields')
      }
      const created = await createAddress(newAddress)
      return { id: created.id, phone: created.phone }
    }
    const selected = addresses.find((a) => a.id === selectedAddressId)
    if (!selected) throw new Error('Please select or add a shipping address')
    return { id: selected.id, phone: selected.phone }
  }

  const handlePlaceOrder = async () => {
    setError('')

    if (!acceptedTerms) {
      triggerError('Please accept the Terms & Privacy Policy to continue')
      return
    }

    setLoading(true)
    try {
      const address = await resolveAddress()
      const order = await createOrder(address.id, buyNowItemIds, deliveryLocation, couponCode.trim())
      setLastOrderId(order.id)

      if (couponCode.trim()) {
        showToast('Coupon applied')
      }

      if (paymentMethod === 'cod') {
        await fetchCart()
        showToast('Order placed successfully')
        const isGuest = !user
        const redirectUrl = isGuest
          ? `/order-confirmation?order_id=${order.id}&token=${order.public_token}`
          : `/order-confirmation?order_id=${order.id}`
        navigate(redirectUrl)
        return
      }

      const paymentData = await initiatePayment(order.id, paymentMethod, address.phone)
      window.location.href = paymentData.payment_url
    } catch (err) {
      triggerError(err.response?.data?.error || err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetryPayment = async () => {
    if (!lastOrderId) return
    setError('')
    setLoading(true)
    try {
      const address = await resolveAddress()
      const paymentData = await initiatePayment(lastOrderId, paymentMethod, address.phone)
      window.location.href = paymentData.payment_url
    } catch (err) {
      triggerError(err.response?.data?.error || 'Payment retry failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const trustItems = [
    { icon: FiShield, label: 'Secure Checkout' },
    { icon: FiTruck, label: 'Fast Delivery' },
    { icon: FiRotateCcw, label: 'Easy Return' },
    { icon: FiAward, label: 'Original Products' },
  ]

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <Navbar />
        <div className="max-w-3xl mx-auto py-24 px-4 text-center animate-fade-in">
          <FiShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-lg font-medium text-slate-700">Your cart is empty</p>
          <p className="text-sm text-slate-400 mt-1 mb-6">Add a few things and come back to check out</p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3 rounded-full font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Start Shopping
          </a>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      <div className={`transition-all duration-300 ${loading ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <TopBar />
        <Navbar />
      </div>

      {/* Full-page loading overlay — appears above the blurred content while the order is being placed */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-100 px-10 py-8">
            <div className="relative w-12 h-12">
              <span className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">Processing your order</p>
              <p className="text-xs text-slate-400 mt-0.5">Please don't close this page</p>
            </div>
          </div>
        </div>
      )}

      <section className={`max-w-7xl mx-auto px-4 py-10 animate-fade-in transition-all duration-300 ${loading ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Checkout</h1>
        <p className="text-sm text-slate-500 mb-8">Almost there — review and confirm your order</p>

        <div className="flex items-center justify-center mb-10">
          {STEPS.map((step, idx) => {
            const active = idx <= 1
            const Icon = step.icon
            return (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span className={`mt-1.5 text-xs ${active ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 transition-colors duration-300 ${active ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            <div className="rounded-2xl border border-slate-100 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="text-blue-600" size={18} />
                <h2 className="font-semibold text-slate-900">Shipping Address</h2>
              </div>

              {addresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-300 ${selectedAddressId === addr.id
                        ? 'border-blue-500 ring-1 ring-blue-100 bg-blue-50/40'
                        : 'border-slate-100 hover:border-slate-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-blue-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{addr.full_name} — {addr.phone}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{addr.full_address}</p>
                      </div>
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline mt-2"
                  >
                    <FiPlus size={14} /> Add a new address
                  </button>
                </div>
              )}

              {showNewAddressForm && (
                <div className="space-y-3 animate-fade-in">
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Full name"
                      value={newAddress.full_name}
                      onChange={handleNewAddressChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone number"
                      value={newAddress.phone}
                      onChange={handleNewAddressChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-sm"
                    />
                  </div>
                  <textarea
                    name="full_address"
                    placeholder="Full address"
                    value={newAddress.full_address}
                    onChange={handleNewAddressChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none text-sm"
                  />
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-sm text-slate-500 hover:underline"
                    >
                      Cancel, use saved address instead
                    </button>
                  )}
                </div>
              )}
            </div>

            <section>
              <h2 className="text-lg font-semibold mb-3">Delivery Location</h2>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all duration-300 ${deliveryLocation === 'inside_dhaka'
                    ? 'border-blue-500 ring-1 ring-blue-100 bg-blue-50/40'
                    : 'border-slate-100 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery_location"
                      checked={deliveryLocation === 'inside_dhaka'}
                      onChange={() => setDeliveryLocation('inside_dhaka')}
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-semibold text-slate-800">Inside Dhaka</span>
                  </div>
                  <span className="text-xs text-slate-500 ml-6">
                    {checkoutTotal > 2500 ? 'Free (order over ৳2500)' : '৳60 delivery charge'}
                  </span>
                </label>
                <label
                  className={`flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all duration-300 ${deliveryLocation === 'outside_dhaka'
                    ? 'border-blue-500 ring-1 ring-blue-100 bg-blue-50/40'
                    : 'border-slate-100 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery_location"
                      checked={deliveryLocation === 'outside_dhaka'}
                      onChange={() => setDeliveryLocation('outside_dhaka')}
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-semibold text-slate-800">Outside Dhaka</span>
                  </div>
                  <span className="text-xs text-slate-500 ml-6">
                    {checkoutTotal > 2500 ? 'Free (order over ৳2500)' : '৳130 delivery charge'}
                  </span>
                </label>
              </div>
            </section>

            <div className="rounded-2xl border border-slate-100 p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="text-blue-600" size={18} />
                <h2 className="font-semibold text-slate-900">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all duration-300 ${paymentMethod === option.value
                      ? 'border-blue-500 ring-1 ring-blue-100 bg-blue-50/40 scale-[1.01]'
                      : 'border-slate-100 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === option.value}
                        onChange={() => setPaymentMethod(option.value)}
                        className="accent-blue-600"
                      />
                      <span className={`text-sm font-semibold ${option.accent}`}>{option.label}</span>
                    </div>
                    <span className="text-xs text-slate-500 ml-6">{option.hint}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Coupon section */}
            <section>
              <label className="text-sm font-semibold text-slate-800 mb-2 block">Coupon Code (optional)</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full border rounded px-3 py-2 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <p className="text-xs text-slate-400 mt-1">Applied automatically when you place the order.</p>
            </section>

            <label className="flex items-start gap-2.5 px-1">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 accent-blue-600"
              />
              <p className="text-sm text-slate-600">
                I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </label>

            {error && (
              <div className={`text-sm bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 ${shake ? 'animate-shake' : ''}`}>
                <p>{error}</p>
                {lastOrderId && paymentMethod !== 'cod' && (
                  <button
                    type="button"
                    onClick={handleRetryPayment}
                    className="text-sm font-medium underline mt-1"
                  >
                    Retry payment
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-2xl border border-slate-100 p-5 md:p-6 space-y-4">
              <h2 className="font-semibold text-slate-900">Order Summary</h2>
              <div className="space-y-3 text-sm max-h-56 overflow-y-auto pr-1">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span className="text-slate-600">
                      {item.variant.product_name}
                      <span className="text-slate-1000 text-orange-600"> ({item.variant.size}/{item.variant.color}) x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-slate-800 shrink-0">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(checkoutTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? 'Placing Order...' : `Place Order • ${formatPrice(grandTotal)}`}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-100 p-4 grid grid-cols-2 gap-3">
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
                  <Icon size={14} className="text-blue-600 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={`transition-all duration-300 ${loading ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <Footer />
      </div>
    </div>
  )
}

export default Checkout