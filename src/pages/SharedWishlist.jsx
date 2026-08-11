import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiShoppingBag, FiAlertCircle } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { getSharedWishlist } from '../api/wishlist'

const SharedWishlist = () => {
    const { token } = useParams()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        getSharedWishlist(token)
            .then((data) => setItems(data.results || data))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [token])

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">
                            SHARED WITH YOU
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">A Friend's Wishlist</h1>
                        <p className="text-slate-500">
                            {loading ? 'Loading…' : `${items.length} item${items.length !== 1 ? 's' : ''}`}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-10">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                                <div className="aspect-square bg-slate-200" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16 rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white">
                        <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5">
                            <FiAlertCircle className="text-red-400" size={32} />
                        </div>
                        <p className="text-slate-700 font-semibold text-lg">This wishlist link isn't valid</p>
                        <p className="text-sm text-slate-400 mt-1 mb-6">It may have been removed, or the link was typed incorrectly</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"
                        >
                            <FiShoppingBag size={15} /> Browse Wearify
                        </Link>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-5">
                            <FiHeart className="text-blue-500" size={32} />
                        </div>
                        <p className="text-slate-700 font-semibold text-lg">This wishlist is empty</p>
                        <p className="text-sm text-slate-400 mt-1 mb-6">Your friend hasn't saved anything yet</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"
                        >
                            <FiShoppingBag size={15} /> Browse Wearify
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        <AnimatePresence>
                            {items.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <ProductCard product={item.product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    )
}

export default SharedWishlist