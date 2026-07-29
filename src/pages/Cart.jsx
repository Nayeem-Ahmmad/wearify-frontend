import { useState } from 'react'
import { FiShoppingBag, FiTrash2, FiChevronRight, FiShield, FiRefreshCw, FiCheck, FiTruck } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RecentlyViewed from '../components/RecentlyViewed'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { formatPrice } from '../utils/productHelpers'
import { API_BASE_URL } from '../api/axios'

const FREE_SHIPPING_THRESHOLD = 2000

const trustBadges = [
    { icon: FiShield, label: 'Secure Checkout' },
    { icon: FiCheck, label: 'Original Product' },
    { icon: FiRefreshCw, label: 'Easy Return', comingSoon: true },
    { icon: FiTruck, label: 'Fast Delivery' },
]

const paymentMethods = ['VISA', 'Mastercard', 'bKash', 'Nagad', 'COD']

const Cart = () => {
    const { cart, cartCount, loading, removeItem, updateItem } = useCart()
    const { showToast } = useToast()
    const [removingIds, setRemovingIds] = useState([])
    const [updatingIds, setUpdatingIds] = useState([])

    const handleRemove = async (itemId) => {
        setRemovingIds((prev) => [...prev, itemId])
        setTimeout(async () => {
            try {
                await removeItem(itemId)
                showToast('Item removed from cart')
            } catch {
                showToast('Could not remove item')
            }
        }, 300)
    }

    const handleQuantityChange = async (itemId, newQty) => {
        if (newQty < 1) return
        setUpdatingIds((prev) => [...prev, itemId])
        try {
            await updateItem(itemId, newQty)
        } catch {
            showToast('Could not update quantity')
        } finally {
            setUpdatingIds((prev) => prev.filter((id) => id !== itemId))
        }
    }

    const subtotal = cart.total || 0
    const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <TopBar />
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-16 space-y-4 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
                    ))}
                </div>
                <Footer />
            </div>
        )
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <TopBar />
                <Navbar />
                <div className="max-w-lg mx-auto px-4 py-24 text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                        <FiShoppingBag size={40} className="text-blue-400" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Your Cart is Empty</h1>
                    <p className="text-sm text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>

                    <a
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3 rounded-full font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                    >
                        Shop Now
                    </a>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pb-24 md:pb-4">
            <TopBar />
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
                        <p className="text-sm text-slate-500 mt-1">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
                    </div>
                    <a href="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
                        Continue Shopping <FiChevronRight size={14} />
                    </a>
                </div>

                <div className="grid lg:grid-cols-[1fr_340px] gap-8">
                    <div className="space-y-3">
                        {cart.items.map((item) => {
                            const variant = item.variant
                            const image = variant.product_image ||
                                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80'
                            const isRemoving = removingIds.includes(item.id)
                            const isUpdating = updatingIds.includes(item.id)
                            const lowStock = variant.stock_quantity > 0 && variant.stock_quantity <= 5

                            return (
                                <div
                                    key={item.id}
                                    className={`flex gap-4 p-4 rounded-2xl border border-slate-100 transition-all duration-300 ${isRemoving ? 'opacity-0 -translate-x-4' : 'opacity-100 hover:shadow-md'
                                        }`}
                                >
                                    <a href={`/products/${variant.product_slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                        <img src={image} alt={variant.product_name} className="w-full h-full object-cover" />
                                    </a>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                {variant.product_brand && (
                                                    <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wide">
                                                        {variant.product_brand}
                                                    </p>
                                                )}

                                                <a
                                                    href={`/products/${variant.product_slug}`}
                                                    className="font-medium text-slate-900 hover:text-blue-600 transition-colors duration-300 truncate block"
                                                >
                                                    {variant.product_name}
                                                </a>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {variant.size && `Size: ${variant.size}`}
                                                    {variant.size && variant.color && ' | '}
                                                    {variant.color && `Color: ${variant.color}`}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors duration-300 shrink-0"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>

                                        {lowStock && (
                                            <p className="text-[11px] text-orange-500 mt-1">Only {variant.stock_quantity} left in stock</p>
                                        )}

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-slate-200 rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    disabled={isUpdating}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors duration-300 disabled:opacity-40"
                                                >
                                                    −
                                                </button>
                                                <span key={item.quantity} className="w-8 text-center text-sm font-medium animate-fade-in">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    disabled={isUpdating || item.quantity >= variant.stock_quantity}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors duration-300 disabled:opacity-40"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <span key={item.quantity + '-' + variant.price} className="font-bold text-slate-900 animate-fade-in">
                                                {formatPrice(variant.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div>
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <div className="p-5 rounded-2xl border border-slate-100">
                                {remaining > 0 ? (
                                    <div className="mb-5">
                                        <p className="text-xs text-slate-500 mb-2">
                                            Add <span className="font-semibold text-blue-600">{formatPrice(remaining)}</span> more for free shipping
                                        </p>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-5 flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                                        <FiCheck size={16} /> You've unlocked free shipping!
                                    </div>
                                )}

                                <h2 className="font-bold text-slate-900 mb-4">Order Summary</h2>

                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span key={subtotal} className="animate-fade-in">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Shipping</span>
                                        <span className="text-slate-400">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 my-4" />

                                <div className="flex justify-between items-baseline mb-5">
                                    <span className="font-semibold text-slate-900">Total</span>
                                    <span key={'total-' + subtotal} className="text-xl font-bold text-blue-600 animate-fade-in">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>


                                <a
                                    href="/checkout"
                                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                                >
                                    Proceed to Checkout
                                </a>

                                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                                    {paymentMethods.map((p) => (
                                        <span key={p} className="text-[10px] px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-100">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3">
                                {trustBadges.map(({ icon: Icon, label, comingSoon }) => (
                                    <div key={label} className="flex items-center gap-2 text-xs text-slate-600">
                                        <Icon size={15} className="text-blue-600 shrink-0" />
                                        <span>{label}</span>
                                        {comingSoon && (
                                            <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Soon</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <RecentlyViewed />
            </div >

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 md:hidden">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-slate-500">Total ({cartCount} items)</p>
                        <p className="font-bold text-blue-600">{formatPrice(subtotal)}</p>
                    </div>

                    <a
                        href="/checkout"
                        className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300"
                    >
                        Checkout
                    </a>
                </div>
            </div >

            <Footer />
        </div >
    )
}

export default Cart