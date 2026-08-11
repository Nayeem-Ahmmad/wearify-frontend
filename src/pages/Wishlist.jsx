import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiShare2, FiCheck } from 'react-icons/fi'
import { useState } from 'react'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

const Wishlist = () => {
    const { items, loading } = useWishlist()
    const { user } = useAuth()
    const { showToast } = useToast()
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        if (!user?.wishlist_share_token) return
        const shareUrl = `${window.location.origin}/wishlist/shared/${user.wishlist_share_token}`

        if (navigator.share) {
            try {
                await navigator.share({ title: 'My Wearify Wishlist', url: shareUrl })
            } catch {
                // user cancelled the share sheet — nothing to do
            }
        } else {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            showToast('Wishlist link copied to clipboard')
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-14">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,_#2563EB_0%,_transparent_45%),radial-gradient(circle_at_85%_80%,_#9333EA_0%,_transparent_45%)]" />
                <div className="relative max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start justify-between gap-4 flex-wrap"
                    >
                        <div>
                            <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 mb-2">
                                SAVED FOR LATER
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">My Wishlist</h1>
                            <p className="text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
                        </div>

                        {items.length > 0 && (
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-sm font-medium hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shrink-0"
                            >
                                {copied ? <FiCheck size={15} className="text-green-500" /> : <FiShare2 size={15} />}
                                {copied ? 'Link Copied!' : 'Share Wishlist'}
                            </button>
                        )}
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
                ) : items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white"
                    >
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-5">
                            <FiHeart className="text-blue-500" size={32} />
                        </div>
                        <p className="text-slate-700 font-semibold text-lg">Your wishlist is empty</p>
                        <p className="text-sm text-slate-400 mt-1 mb-6">Save products you love and find them here anytime</p>

                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"
                        >
                            <FiShoppingBag size={15} /> Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        <AnimatePresence>
                            {items.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
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

export default Wishlist