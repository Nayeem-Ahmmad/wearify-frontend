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

function App() {
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
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App