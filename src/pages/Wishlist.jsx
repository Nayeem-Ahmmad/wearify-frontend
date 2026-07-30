import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useWishlist } from '../context/WishlistContext'
import { FiHeart } from 'react-icons/fi'

const Wishlist = () => {
    const { items, loading } = useWishlist()

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <TopBar />
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-60 bg-slate-100 rounded-2xl" />
                    ))}
                </div>
                <Footer />
            </div>
        )
    }

    if (!items || items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <TopBar />
                <Navbar />
                <div className="max-w-lg mx-auto px-4 py-24 text-center">
                    <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-6">
                        <FiHeart size={40} className="text-pink-500" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h1>
                    <p className="text-sm text-slate-500 mb-8">Save products you love to view or buy later.</p>

                    <a
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-pink-600 text-white px-7 py-3 rounded-full font-medium hover:bg-pink-700 hover:scale-105 transition-all duration-300"
                    >
                        Browse Products
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

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Your Wishlist</h1>
                        <p className="text-sm text-slate-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
                    </div>
                    <a href="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-pink-600 hover:underline">
                        Continue Shopping
                    </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {items.map((w) => (
                        <ProductCard key={w.id} product={w.product} />
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Wishlist
