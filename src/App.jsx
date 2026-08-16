import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ToastProvider } from './components/Toast'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import MyOrders from './pages/MyOrders'
import PaymentResult from './pages/PaymentResult'
import Wishlist from './pages/Wishlist'
import SharedWishlist from './pages/SharedWishlist'
import CategoriesPage from './pages/Categories'
import NewArrivalsPage from './pages/NewArrivals'
import Account from './pages/Account'
import DealsPage from './pages/Deals'
import Terms from './pages/Terms'
import PrivacyPolicy from './pages/PrivacyPolicy'
import FAQPage from './pages/FAQ'
import Help from './pages/Help'
import TrackOrder from './pages/TrackOrder'
import ShippingInfo from './pages/ShippingInfo'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Shown whenever the backend responds 503 with { maintenance: true, message }.
// The axios interceptor (api/axios.js) dispatches a 'maintenance-mode'
// window event when this happens; we listen for it below.
function MaintenancePage({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center px-4">
      <div className="max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          We'll be back soon
        </h1>
        <p className="text-slate-500 leading-relaxed">
          {message || "We're currently performing scheduled maintenance. We'll be back shortly."}
        </p>
      </div>
    </div>
  )
}

function App() {
  const [maintenanceMessage, setMaintenanceMessage] = useState(null)

  useEffect(() => {
    const handler = (e) => setMaintenanceMessage(e.detail?.message || '')
    window.addEventListener('maintenance-mode', handler)
    return () => window.removeEventListener('maintenance-mode', handler)
  }, [])

  if (maintenanceMessage !== null) {
    return <MaintenancePage message={maintenanceMessage} />
  }

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/payment/success" element={<PaymentResult type="success" />} />
                <Route path="/payment/fail" element={<PaymentResult type="fail" />} />
                <Route path="/payment/cancel" element={<PaymentResult type="cancel" />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/wishlist/shared/:token" element={<SharedWishlist />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/account" element={<Account />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/help" element={<Help />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/shipping-info" element={<ShippingInfo />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App