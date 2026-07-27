import { useEffect, useState } from 'react'
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiChevronDown } from 'react-icons/fi'
import Logo from './Logo'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Deals', href: '/deals' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [cartCount] = useState(2)
  const [wishlistCount] = useState(3)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
        <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
            scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-md'
            : 'bg-white'
        }`}
        >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
            <Logo />

            <div className="hidden md:flex flex-1 items-center">
            <div className="flex w-full max-w-xl items-center rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300">
                <button className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 border-r border-slate-200">
                All Categories <FiChevronDown size={14} />
                </button>
                <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
                />
                <button className="p-2 mr-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                <FiSearch size={18} />
                </button>
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

            <a href="/login" className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors duration-300">
                <FiUser size={20} />
                <div className="text-xs leading-tight text-left">
                <div className="text-slate-400">Sign In</div>
                <div className="font-medium">My Account</div>
                </div>
            </a>

            <button className="md:hidden text-slate-700">
                <FiMenu size={24} />
            </button>
            </div>
        </div>

        <div className="hidden md:block border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-8 py-2.5 text-sm font-medium text-slate-700">
                {navLinks.map((link) => (
                
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
        </header>
    )
    }

export default Navbar