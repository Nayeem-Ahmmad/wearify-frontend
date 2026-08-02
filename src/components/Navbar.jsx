import { useEffect, useState, useRef } from 'react'
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiChevronDown, FiX, FiLogOut } from 'react-icons/fi'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getProducts } from '../api/products'
import { useWishlist } from '../context/WishlistContext'
import { getProductImage, getProductPrice, formatPrice } from '../utils/productHelpers'
import { API_BASE_URL } from '../api/axios'

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/deals' },
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
]

const getAvatarUrl = (path) => {
    if (!path) return null
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`
}

const Navbar = () => {
    const { authenticated, user, logout } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [bump, setBump] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { cartCount } = useCart()

    const [searchQuery, setSearchQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [searching, setSearching] = useState(false)
    const searchRef = useRef(null)
    const { count: wishlistCount } = useWishlist()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([])
            return
        }
        setSearching(true)
        const timer = setTimeout(() => {
            getProducts({ search: searchQuery.trim(), page_size: 5 })
                .then((data) => setSuggestions(data.results || data))
                .catch(() => setSuggestions([]))
                .finally(() => setSearching(false))
        }, 350)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        setShowSuggestions(false)
        window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`
    }

    const headerClass = scrolled
        ? 'bg-white/80 backdrop-blur-md shadow-md'
        : 'bg-white'

    return (
        <header className={'sticky top-0 z-50 w-full transition-all duration-300 ' + headerClass}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
                <Logo />

                <div className="hidden md:flex flex-1 items-center">
                    <div ref={searchRef} className="relative w-full max-w-xl">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex w-full items-center rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300"
                        >
                            <button type="button" className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 border-r border-slate-200">
                                All Categories <FiChevronDown size={14} />
                            </button>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Search for products, brands and more..."
                                className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
                            />
                            <button type="submit" className="p-2 mr-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                                <FiSearch size={18} />
                            </button>
                        </form>

                        {showSuggestions && searchQuery.trim() && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                                {searching ? (
                                    <div className="px-4 py-6 text-center text-sm text-slate-400">Searching...</div>
                                ) : suggestions.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm text-slate-400">No products found</div>
                                ) : (
                                    <>
                                        {suggestions.map((p) => (
                                            <a
                                                key={p.id}
                                                href={`/products/${p.slug}`}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors duration-200"
                                            >
                                                <img
                                                    src={getProductImage(p)}
                                                    alt={p.name}
                                                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-slate-800 truncate">{p.name}</p>
                                                    <p className="text-xs text-blue-600 font-medium">{formatPrice(getProductPrice(p))}</p>
                                                </div>
                                            </a>
                                        ))}

                                        <a
                                            href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                                            className="block px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-slate-50 text-center border-t border-slate-100 mt-1"
                                        >
                                            View all results for "{searchQuery.trim()}"
                                        </a>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-5 ml-auto">
                    <a href="/wishlist" className="relative hidden sm:flex flex-col items-center text-slate-700 hover:text-blue-600 transition-colors duration-300">
                        <FiHeart size={20} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {wishlistCount}
                            </span>
                        )}
                    </a>

                    <a
                        href="/cart"
                        onClick={() => { setBump(true); setTimeout(() => setBump(false), 300) }}
                        className="relative flex flex-col items-center text-slate-700 hover:text-blue-600 transition-colors duration-300"
                    >
                        <FiShoppingCart size={20} className={bump ? 'animate-bounce' : ''} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </a>

                    {authenticated ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2 rounded-full focus:outline-none">
                                {getAvatarUrl(user?.profile_image) ? (
                                    <img
                                        src={getAvatarUrl(user?.profile_image)}
                                        alt="Profile"
                                        className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 hover:border-blue-400 transition-colors duration-300"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors duration-300">
                                        <FiUser size={20} />
                                    </div>
                                )}
                            </button>

                            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <a href="/account" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                                    My Account
                                </a>
                                <a href="/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                                    My Orders
                                </a>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <a href="/login" className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors duration-300">
                            <FiUser size={20} />
                            <div className="text-xs leading-tight text-left">
                                <div className="text-slate-400">Sign In</div>
                                <div className="font-medium">My Account</div>
                            </div>
                        </a>
                    )}

                    <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-slate-700">
                        <FiMenu size={24} />
                    </button>
                </div>
            </div>

            <div className="hidden md:block border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex items-center gap-8 py-2.5 text-sm font-medium text-slate-700">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="relative hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 animate-fade-in"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl animate-scale-in overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <Logo />
                            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-700">
                                <FiX size={22} />
                            </button>
                        </div>

                        <nav className="flex flex-col py-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="border-t border-slate-100 py-2">
                            <a
                                href="/wishlist"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                            >
                                <FiHeart size={16} /> Wishlist
                                {wishlistCount > 0 && (
                                    <span className="ml-auto bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </a>
                            <a
                                href="/cart"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                            >
                                <FiShoppingCart size={16} /> Cart
                                {cartCount > 0 && (
                                    <span className="ml-auto bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </a>
                        </div>

                        <div className="border-t border-slate-100 py-2">
                            {authenticated ? (
                                <>
                                    <a
                                        href="/account"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <FiUser size={16} /> My Account
                                    </a>
                                    <a
                                        href="/orders"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <FiShoppingCart size={16} /> My Orders
                                    </a>
                                    <button
                                        onClick={() => { setMobileMenuOpen(false); logout() }}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <FiLogOut size={16} /> Logout
                                    </button>
                                </>
                            ) : (
                                <a
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                >
                                    <FiUser size={16} /> Sign In
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar