import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiUser, FiPhone, FiMail, FiCamera, FiMapPin, FiPlus,
    FiEdit2, FiTrash2, FiStar, FiLogOut, FiSave, FiGrid,
    FiPackage, FiClock, FiCheckCircle, FiHeart, FiShoppingCart,
    FiHelpCircle, FiMessageCircle, FiFileText, FiChevronRight,
    FiXCircle, FiArrowRight, FiTrash, FiShield,
} from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../components/Toast'
import { getMyProfile, updateProfile, updateAccount } from '../api/profile'
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../api/addresses'
import { formatPrice } from '../utils/productHelpers'
import api from '../api/axios'
import { API_BASE_URL } from '../api/axios'

/* ============================================================
   DESIGN TOKENS — Daraz-inspired marketplace identity
   Primary  : #F85606 (Daraz orange)
   Ink      : #191919 / #4B5563
   Surface  : #FFFFFF / #F5F5F7
   Accent   : #FFA800 (rating gold)
   ============================================================ */

const TABS = [
    { key: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { key: 'profile', label: 'My Profile', icon: FiUser },
    { key: 'addresses', label: 'Addresses', icon: FiMapPin },
    { key: 'orders', label: 'My Orders', icon: FiPackage },
    { key: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { key: 'cart', label: 'Cart', icon: FiShoppingCart },
    { key: 'support', label: 'Support', icon: FiHelpCircle },
]

const STATUS_META = {
    pending: { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    confirmed: { badge: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
    processing: { badge: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
    packed: { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    shipped: { badge: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
    out_for_delivery: { badge: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
    delivered: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    paid: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    cancelled: { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
    returned: { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
    refunded: { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
}

const formatStatus = (status) => status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const CountUp = ({ value, duration = 900 }) => {
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        let start = null
        let frame

        const step = (timestamp) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            setDisplay(Math.floor(progress * value))
            if (progress < 1) frame = requestAnimationFrame(step)
        }

        frame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frame)
    }, [value, duration])

    return <>{display}</>
}

const Account = () => {
    const { user, logout, refreshUser } = useAuth()
    const { cart, cartCount, updateItem, removeItem } = useCart()
    const { items: wishlistItems, count: wishlistCount, loading: wishlistLoading } = useWishlist()
    const { showToast } = useToast()
    const fileInputRef = useRef(null)

    const [activeTab, setActiveTab] = useState('dashboard')

    const [profile, setProfile] = useState(null)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)
    const [savingProfile, setSavingProfile] = useState(false)
    const [savingAccount, setSavingAccount] = useState(false)
    const [loading, setLoading] = useState(true)

    const [addresses, setAddresses] = useState([])
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [editingAddressId, setEditingAddressId] = useState(null)
    const [addressForm, setAddressForm] = useState({ full_name: '', phone: '', full_address: '', is_default: false })
    const [savingAddress, setSavingAddress] = useState(false)

    const [orders, setOrders] = useState([])
    const [cancellingId, setCancellingId] = useState(null)

    const loadData = () => {
        setLoading(true)
        Promise.all([
            getMyProfile(),
            getAddresses(),
            api.get('/shop/orders/'),
        ])
            .then(([profileData, addressData, ordersRes]) => {
                setProfile(profileData)
                setUsername(profileData?.user?.username || '')
                setEmail(profileData?.user?.email || '')
                setPhone(profileData?.phone || '')
                setAddresses(addressData.results || addressData)
                setOrders(ordersRes.data.results || ordersRes.data)
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadData()
    }, [])

    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const processingOrders = orders.filter((o) => ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'].includes(o.status)).length
    const completedOrders = orders.filter((o) => o.status === 'delivered').length

    const getAvatarUrl = () => {
        if (avatarPreview) return avatarPreview
        if (profile?.profile_image) {
            return profile.profile_image.startsWith('http') ? profile.profile_image : `${API_BASE_URL}${profile.profile_image}`
        }
        return null
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const handleSaveProfile = async () => {
        if (!profile) return
        setSavingProfile(true)
        try {
            const formData = new FormData()
            formData.append('phone', phone)
            if (avatarFile) formData.append('profile_image', avatarFile)
            const updated = await updateProfile(profile.id, formData)
            setProfile(updated)
            setAvatarFile(null)
            if (avatarPreview) URL.revokeObjectURL(avatarPreview)
            setAvatarPreview(null)
        } catch {
            showToast('Could not update profile')
        } finally {
            setSavingProfile(false)
        }
    }

    const handleSaveAccount = async () => {
        setSavingAccount(true)
        try {
            await updateAccount({ username, email })
            refreshUser()
        } catch (err) {
            const data = err.response?.data
            const message = data ? Object.values(data).flat().join(' ') : 'Could not update account info'
            showToast(message)
            throw err
        } finally {
            setSavingAccount(false)
        }
    }

    const handleSaveAll = async () => {
        try {
            await handleSaveAccount()
            await handleSaveProfile()
            showToast('Profile updated successfully')
        } catch {
            // error toast already shown by whichever step failed
        }
    }

    const resetAddressForm = () => {
        setAddressForm({ full_name: '', phone: '', full_address: '', is_default: false })
        setEditingAddressId(null)
        setShowAddressForm(false)
    }

    const openNewAddressForm = () => {
        setAddressForm({
            full_name: profile?.user?.username || '',
            phone: profile?.phone || '',
            full_address: '',
            is_default: false,
        })
        setEditingAddressId(null)
        setShowAddressForm(true)
    }

    const handleAddressSubmit = async (e) => {
        e.preventDefault()
        setSavingAddress(true)
        try {
            if (editingAddressId) {
                await updateAddress(editingAddressId, addressForm)
                showToast('Address updated')
            } else {
                await createAddress(addressForm)
                showToast('Address added')
            }
            resetAddressForm()
            loadData()
        } catch {
            showToast('Could not save address')
        } finally {
            setSavingAddress(false)
        }
    }

    const handleEditAddress = (addr) => {
        setAddressForm({
            full_name: addr.full_name,
            phone: addr.phone,
            full_address: addr.full_address,
            is_default: addr.is_default,
        })
        setEditingAddressId(addr.id)
        setShowAddressForm(true)
    }

    const handleDeleteAddress = async (id) => {
        try {
            await deleteAddress(id)
            showToast('Address removed')
            loadData()
        } catch {
            showToast('Could not remove address')
        }
    }

    const handleSetDefault = async (addr) => {
        try {
            await updateAddress(addr.id, { is_default: true })
            showToast('Default address updated')
            loadData()
        } catch {
            showToast('Could not update default address')
        }
    }

    const handleCancelOrder = async (orderId) => {
        setCancellingId(orderId)
        try {
            await api.post(`/shop/orders/${orderId}/cancel/`)
            showToast('Order cancelled')
            loadData()
        } catch (err) {
            showToast(err.response?.data?.error || 'Could not cancel this order')
        } finally {
            setCancellingId(null)
        }
    }

    const statCards = [
        { label: 'Total Orders', value: totalOrders, icon: FiPackage, color: 'from-[#F85606] to-[#FF8A3D]' },
        { label: 'Pending', value: pendingOrders, icon: FiClock, color: 'from-amber-500 to-amber-400' },
        { label: 'Processing', value: processingOrders, icon: FiPackage, color: 'from-sky-500 to-indigo-500' },
        { label: 'Completed', value: completedOrders, icon: FiCheckCircle, color: 'from-emerald-500 to-teal-500' },
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F7]">
                <TopBar />
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-16 animate-pulse space-y-4">
                    <div className="h-28 sm:h-40 bg-white rounded-2xl border border-[#ECECEE]" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 sm:h-24 bg-white rounded-xl border border-[#ECECEE]" />)}
                    </div>
                    <div className="h-64 bg-white rounded-2xl border border-[#ECECEE]" />
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            <TopBar />
            <Navbar />

            {/* ================= HERO / IDENTITY BAND ================= */}
            <section className="relative overflow-hidden bg-gradient-to-r from-[#1C1C1E] via-[#2A2320] to-[#F85606] py-7 sm:py-10 md:py-12">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_10%_10%,_#FF8A3D_0%,_transparent_40%),radial-gradient(circle_at_90%_90%,_#F85606_0%,_transparent_45%)]" />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-5 flex flex-col xs:flex-row items-center xs:items-center gap-4 sm:gap-6 text-center xs:text-left">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white shadow-xl ring-4 ring-white/20 shrink-0">
                        {getAvatarUrl() ? (
                            <img src={getAvatarUrl()} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F85606] to-[#FF8A3D]">
                                <span className="text-white font-bold text-2xl sm:text-3xl md:text-4xl select-none">
                                    {(profile?.user?.username || 'U').trim().charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="min-w-0 w-full">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-[#FFB27A] mb-1.5 uppercase">
                            <FiShield size={12} /> My Account
                        </span>
                        <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white truncate">
                            {profile?.user?.username || 'My Account'}
                        </h1>
                        <p className="text-xs sm:text-sm text-white/70 mt-0.5 truncate">{profile?.user?.email || ''}</p>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-5 py-6 sm:py-10">
                <div className="grid lg:grid-cols-[240px_1fr] gap-5 sm:gap-8">

                    {/* ================= SIDEBAR / TAB NAV ================= */}
                    <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-white border border-[#ECECEE] shadow-sm p-2 -mx-4 px-4 sm:mx-0 sm:px-2 overflow-x-auto lg:overflow-visible scrollbar-none">
                        <nav className="flex lg:flex-col gap-1.5 min-w-max lg:min-w-0">
                            {TABS.map((tab) => {
                                const Icon = tab.icon
                                const active = activeTab === tab.key
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${active
                                            ? 'bg-[#F85606] text-white shadow-md shadow-orange-200'
                                            : 'text-[#4B5563] hover:bg-[#FFF1EA] hover:text-[#F85606]'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                    </button>
                                )
                            })}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0 mt-1 lg:mt-1 border-t-0 lg:border-t border-[#ECECEE] lg:pt-3"
                            >
                                <FiLogOut size={16} /> Logout
                            </button>
                        </nav>
                    </aside>

                    <div className="min-w-0">
                        <AnimatePresence mode="wait">

                            {/* ================= DASHBOARD ================= */}
                            {activeTab === 'dashboard' && (
                                <motion.div
                                    key="dashboard"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-4 sm:space-y-6"
                                >
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1C1C1E] to-[#F85606] p-5 sm:p-7 text-white flex items-center justify-between gap-4">
                                        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
                                        <div className="relative">
                                            <p className="text-base sm:text-lg font-bold">Welcome back, {profile?.user?.username || 'there'}!</p>
                                            <p className="text-white/80 text-xs sm:text-sm mt-1">You've made {totalOrders} order{totalOrders !== 1 ? 's' : ''} with us.</p>
                                        </div>
                                        <span className="relative hidden sm:block text-4xl">👋</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                        {statCards.map((stat, idx) => {
                                            const Icon = stat.icon
                                            return (
                                                <motion.div
                                                    key={stat.label}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.06 }}
                                                    className="rounded-xl bg-white border border-[#ECECEE] p-3.5 sm:p-4 hover:shadow-lg hover:-translate-y-1 hover:border-[#F85606]/30 transition-all duration-300"
                                                >
                                                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2.5 sm:mb-3`}>
                                                        <Icon className="text-white" size={15} />
                                                    </div>
                                                    <p className="text-xl sm:text-2xl font-bold text-[#191919]">
                                                        <CountUp value={stat.value} />
                                                    </p>
                                                    <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">{stat.label}</p>
                                                </motion.div>
                                            )
                                        })}
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className="flex items-center justify-between rounded-xl bg-white border border-[#ECECEE] p-4 sm:p-5 hover:shadow-lg hover:-translate-y-1 hover:border-[#F85606]/30 transition-all duration-300 group text-left"
                                        >
                                            <div>
                                                <p className="font-semibold text-[#191919] text-sm sm:text-base">Order History</p>
                                                <p className="text-xs text-[#6B7280] mt-0.5">Track and manage orders</p>
                                            </div>
                                            <FiChevronRight className="text-[#9CA3AF] group-hover:translate-x-1 group-hover:text-[#F85606] transition-all duration-300 shrink-0" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('wishlist')}
                                            className="flex items-center justify-between rounded-xl bg-white border border-[#ECECEE] p-4 sm:p-5 hover:shadow-lg hover:-translate-y-1 hover:border-[#F85606]/30 transition-all duration-300 group text-left"
                                        >
                                            <div>
                                                <p className="font-semibold text-[#191919] text-sm sm:text-base">My Wishlist</p>
                                                <p className="text-xs text-[#6B7280] mt-0.5">{wishlistCount} saved product{wishlistCount !== 1 ? 's' : ''}</p>
                                            </div>
                                            <FiChevronRight className="text-[#9CA3AF] group-hover:translate-x-1 group-hover:text-[#F85606] transition-all duration-300 shrink-0" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('cart')}
                                            className="flex items-center justify-between rounded-xl bg-white border border-[#ECECEE] p-4 sm:p-5 hover:shadow-lg hover:-translate-y-1 hover:border-[#F85606]/30 transition-all duration-300 group text-left"
                                        >
                                            <div>
                                                <p className="font-semibold text-[#191919] text-sm sm:text-base">My Cart</p>
                                                <p className="text-xs text-[#6B7280] mt-0.5">{cartCount} item{cartCount !== 1 ? 's' : ''} ready</p>
                                            </div>
                                            <FiChevronRight className="text-[#9CA3AF] group-hover:translate-x-1 group-hover:text-[#F85606] transition-all duration-300 shrink-0" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ================= PROFILE ================= */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="rounded-2xl bg-white border border-[#ECECEE] shadow-sm p-5 sm:p-6 md:p-8"
                                >
                                    <h2 className="font-bold text-[#191919] text-base sm:text-lg mb-5 sm:mb-6 flex items-center gap-2">
                                        <FiUser className="text-[#F85606]" size={18} /> My Profile
                                    </h2>
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                        <div className="flex flex-col items-center gap-3 shrink-0">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#F5F5F7] border-2 border-[#ECECEE]">
                                                {getAvatarUrl() ? (
                                                    <img src={getAvatarUrl()} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F85606] to-[#FF8A3D]">
                                                        <span className="text-white font-bold text-2xl select-none">
                                                            {(profile?.user?.username || 'U').trim().charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center gap-1.5 text-xs sm:text-sm text-[#F85606] font-semibold hover:underline"
                                            >
                                                <FiCamera size={14} /> Change Photo
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </div>

                                        <div className="flex-1 w-full space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-semibold text-[#6B7280] mb-1.5 flex items-center gap-1.5">
                                                        <FiUser size={12} /> Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm outline-none focus:border-[#F85606] focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-[#6B7280] mb-1.5 flex items-center gap-1.5">
                                                        <FiMail size={12} /> Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm outline-none focus:border-[#F85606] focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-[#6B7280] mb-1.5 flex items-center gap-1.5">
                                                    <FiPhone size={12} /> Phone Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="Add your phone number"
                                                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm outline-none focus:border-[#F85606] focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                                                />
                                            </div>

                                            <button
                                                onClick={handleSaveAll}
                                                disabled={savingProfile || savingAccount}
                                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#F85606] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#E64A00] active:scale-95 transition-all duration-200 disabled:opacity-60 shadow-md shadow-orange-200"
                                            >
                                                {(savingProfile || savingAccount) ? (
                                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <FiSave size={14} />
                                                )}
                                                {(savingProfile || savingAccount) ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ================= ADDRESSES ================= */}
                            {activeTab === 'addresses' && (
                                <motion.div
                                    key="addresses"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="rounded-2xl bg-white border border-[#ECECEE] shadow-sm p-5 sm:p-6 md:p-8"
                                >
                                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                                        <div className="flex items-center gap-2">
                                            <FiMapPin className="text-[#F85606]" size={18} />
                                            <h2 className="font-bold text-[#191919] text-base sm:text-lg">Saved Addresses</h2>
                                        </div>
                                        {!showAddressForm && (
                                            <button
                                                onClick={openNewAddressForm}
                                                className="flex items-center gap-1.5 text-sm text-white bg-[#F85606] hover:bg-[#E64A00] font-semibold px-3.5 py-2 rounded-full transition-all duration-200"
                                            >
                                                <FiPlus size={14} /> Add Address
                                            </button>
                                        )}
                                    </div>

                                    {showAddressForm && (
                                        <form onSubmit={handleAddressSubmit} className="space-y-3 mb-5 p-4 rounded-xl bg-[#F5F5F7] border border-[#ECECEE] animate-fade-in">
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                value={addressForm.full_name}
                                                onChange={(e) => setAddressForm((p) => ({ ...p, full_name: e.target.value }))}
                                                required
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#F85606] focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Phone number"
                                                value={addressForm.phone}
                                                onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))}
                                                required
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#F85606] focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                                            />
                                            <textarea
                                                placeholder="Full address"
                                                value={addressForm.full_address}
                                                onChange={(e) => setAddressForm((p) => ({ ...p, full_address: e.target.value }))}
                                                required
                                                rows={3}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#F85606] focus:ring-4 focus:ring-orange-100 transition-all duration-200 resize-none"
                                            />
                                            <label className="flex items-center gap-2 text-sm text-[#4B5563]">
                                                <input
                                                    type="checkbox"
                                                    checked={addressForm.is_default}
                                                    onChange={(e) => setAddressForm((p) => ({ ...p, is_default: e.target.checked }))}
                                                    className="accent-[#F85606]"
                                                />
                                                Set as default address
                                            </label>
                                            <div className="flex items-center gap-3 pt-1">
                                                <button
                                                    type="submit"
                                                    disabled={savingAddress}
                                                    className="bg-[#F85606] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#E64A00] active:scale-95 transition-all duration-200 disabled:opacity-60"
                                                >
                                                    {savingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={resetAddressForm}
                                                    className="text-sm text-[#6B7280] hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {addresses.length === 0 && !showAddressForm ? (
                                        <div className="text-center py-12">
                                            <FiMapPin className="mx-auto text-[#D1D5DB] mb-3" size={32} />
                                            <p className="text-[#6B7280] text-sm">No saved addresses yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-xl border p-4 hover:shadow-md transition-all duration-300 ${addr.is_default ? 'border-[#F85606] ring-1 ring-orange-100 bg-[#FFF8F4]' : 'border-[#ECECEE]'
                                                        }`}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-sm font-semibold text-[#191919]">{addr.full_name} — {addr.phone}</p>
                                                            {addr.is_default && (
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-[#F85606] bg-orange-100 px-2 py-0.5 rounded-full">
                                                                    <FiStar size={9} /> Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-[#6B7280] mt-0.5">{addr.full_address}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                                                        {!addr.is_default && (
                                                            <button
                                                                onClick={() => handleSetDefault(addr)}
                                                                className="text-xs text-[#F85606] font-medium hover:underline"
                                                            >
                                                                Set Default
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleEditAddress(addr)}
                                                            className="text-[#9CA3AF] hover:text-[#F85606] transition-colors duration-200"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAddress(addr.id)}
                                                            className="text-[#9CA3AF] hover:text-red-500 transition-colors duration-200"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ================= ORDERS ================= */}
                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="rounded-2xl bg-white border border-[#ECECEE] shadow-sm p-5 sm:p-6 md:p-8"
                                >
                                    <h2 className="font-bold text-[#191919] text-base sm:text-lg mb-5 flex items-center gap-2">
                                        <FiPackage className="text-[#F85606]" size={18} /> Order History
                                    </h2>

                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FiPackage className="mx-auto text-[#D1D5DB] mb-3" size={32} />
                                            <p className="text-[#6B7280] text-sm">No orders yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {orders.map((order) => {
                                                const meta = STATUS_META[order.status] || { badge: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' }
                                                const canCancel = order.status === 'pending'
                                                return (
                                                    <div key={order.id} className="rounded-xl border border-[#ECECEE] border-l-4 border-l-[#F85606] p-4 hover:shadow-md transition-all duration-300">
                                                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                                            <p className="font-bold text-[#191919] text-sm">{order.order_number}</p>
                                                            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.badge}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                                {formatStatus(order.status)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-[#9CA3AF] mb-3">
                                                            {new Date(order.created_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            {' • '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                        </p>

                                                        {/* Order item details — always visible on every breakpoint, never collapsed */}
                                                        <div className="space-y-2 mb-3 rounded-lg bg-[#FAFAFA] border border-[#F0F0F0] p-2.5 sm:p-3">
                                                            {order.items.map((it, idx) => {
                                                                const name = it.variant?.product_name || it.product_name || it.product?.name || 'Product'
                                                                const size = it.variant?.size
                                                                const color = it.variant?.color
                                                                const qty = it.quantity
                                                                const lineTotal = it.subtotal ?? it.total_price ?? (it.price != null ? it.price * qty : null)
                                                                const unitPrice = it.price ?? it.unit_price
                                                                return (
                                                                    <div
                                                                        key={it.id || idx}
                                                                        className={`flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-3 ${idx !== 0 ? 'pt-2 border-t border-[#F0F0F0]' : ''}`}
                                                                    >
                                                                        <div className="min-w-0">
                                                                            <p className="text-xs sm:text-sm font-medium text-[#191919] truncate">{name}</p>
                                                                            {(size || color) && (
                                                                                <p className="text-[11px] sm:text-xs text-[#9CA3AF]">
                                                                                    {[size, color].filter(Boolean).join(' / ')}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center justify-between xs:justify-end gap-3 shrink-0 text-xs sm:text-sm text-[#4B5563]">
                                                                            <span>Qty: <span className="font-semibold text-[#191919]">{qty}</span></span>
                                                                            {unitPrice != null && (
                                                                                <span className="hidden sm:inline text-[#9CA3AF]">{formatPrice(unitPrice)} each</span>
                                                                            )}
                                                                            {lineTotal != null && (
                                                                                <span className="font-semibold text-[#191919]">{formatPrice(lineTotal)}</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
                                                            <span className="font-bold text-[#F85606] text-sm sm:text-base">{formatPrice(order.total_amount)}</span>
                                                            {canCancel && (
                                                                <button
                                                                    onClick={() => handleCancelOrder(order.id)}
                                                                    disabled={cancellingId === order.id}
                                                                    className="flex items-center gap-1 text-xs text-red-500 font-medium hover:underline disabled:opacity-50"
                                                                >
                                                                    <FiXCircle size={12} />
                                                                    {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ================= WISHLIST ================= */}
                            {activeTab === 'wishlist' && (
                                <motion.div
                                    key="wishlist"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="rounded-2xl bg-white border border-[#ECECEE] shadow-sm p-5 sm:p-6 md:p-8"
                                >
                                    <h2 className="font-bold text-[#191919] text-base sm:text-lg mb-5 flex items-center gap-2">
                                        <FiHeart className="text-[#F85606]" size={18} /> My Wishlist
                                    </h2>

                                    {wishlistLoading ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                            {[1, 2, 3].map((i) => <div key={i} className="aspect-square rounded-xl bg-[#F5F5F7] animate-pulse" />)}
                                        </div>
                                    ) : wishlistItems.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FiHeart className="mx-auto text-[#D1D5DB] mb-3" size={32} />
                                            <p className="text-[#6B7280] text-sm">Your wishlist is empty</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                            {wishlistItems.map((item) => (
                                                <ProductCard key={item.id} product={item.product} />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ================= CART ================= */}
                            {activeTab === 'cart' && (
                                <motion.div
                                    key="cart"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="rounded-2xl bg-white border border-[#ECECEE] shadow-sm p-5 sm:p-6 md:p-8"
                                >
                                    <h2 className="font-bold text-[#191919] text-base sm:text-lg mb-5 flex items-center gap-2">
                                        <FiShoppingCart className="text-[#F85606]" size={18} /> My Cart
                                    </h2>

                                    {cart.items.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FiShoppingCart className="mx-auto text-[#D1D5DB] mb-3" size={32} />
                                            <p className="text-[#6B7280] text-sm">Your cart is empty</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3 mb-5">
                                                {cart.items.map((item) => (
                                                    <div key={item.id} className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 rounded-xl border border-[#ECECEE] p-3">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-[#191919] truncate">{item.variant.product_name}</p>
                                                            <p className="text-xs text-[#9CA3AF]">{item.variant.size}/{item.variant.color}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between xs:justify-end gap-3 shrink-0">
                                                            <div className="flex items-center border border-[#E5E7EB] rounded-lg">
                                                                <button
                                                                    onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                                                    className="w-7 h-7 flex items-center justify-center text-[#4B5563] hover:bg-[#F5F5F7]"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateItem(item.id, item.quantity + 1)}
                                                                    className="w-7 h-7 flex items-center justify-center text-[#4B5563] hover:bg-[#F5F5F7]"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <span className="text-sm font-bold text-[#191919] w-16 text-right">{formatPrice(item.subtotal)}</span>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-[#9CA3AF] hover:text-red-500 transition-colors duration-200"
                                                            >
                                                                <FiTrash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-[#ECECEE]">
                                                <span className="font-bold text-[#191919]">Total</span>
                                                <span className="text-xl font-extrabold text-[#F85606]">{formatPrice(cart.total)}</span>
                                            </div>

                                            <a
                                                href="/checkout"
                                                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#F85606] text-white py-3 rounded-full font-semibold hover:bg-[#E64A00] hover:shadow-lg hover:shadow-orange-200 active:scale-[0.99] transition-all duration-200"
                                            >
                                                Proceed to Checkout <FiArrowRight size={16} />
                                            </a>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* ================= SUPPORT ================= */}
                            {activeTab === 'support' && (
                                <motion.div
                                    key="support"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="rounded-2xl bg-white border border-[#ECECEE] shadow-sm p-5 sm:p-6 md:p-8"
                                >
                                    <h2 className="font-bold text-[#191919] text-base sm:text-lg mb-5 flex items-center gap-2">
                                        <FiHelpCircle className="text-[#F85606]" size={18} /> Support
                                    </h2>
                                    <div className="grid xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                        <a
                                            href="/help"
                                            className="flex flex-col items-center text-center gap-2 rounded-xl border border-[#ECECEE] p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 hover:border-[#F85606]/30 transition-all duration-300"
                                        >
                                            <div className="w-11 h-11 rounded-xl bg-[#F85606] flex items-center justify-center">
                                                <FiHelpCircle className="text-white" size={20} />
                                            </div>
                                            <p className="font-semibold text-[#191919] text-sm">Help Center</p>
                                            <p className="text-xs text-[#6B7280]">Find answers to common questions</p>
                                        </a>

                                        <a
                                            href="/contact"
                                            className="flex flex-col items-center text-center gap-2 rounded-xl border border-[#ECECEE] p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 hover:border-[#F85606]/30 transition-all duration-300"
                                        >
                                            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center">
                                                <FiMessageCircle className="text-white" size={20} />
                                            </div>
                                            <p className="font-semibold text-[#191919] text-sm">Contact Support</p>
                                            <p className="text-xs text-[#6B7280]">Get in touch with our team</p>
                                        </a>

                                        <a
                                            href="/faq"
                                            className="flex flex-col items-center text-center gap-2 rounded-xl border border-[#ECECEE] p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 hover:border-[#F85606]/30 transition-all duration-300 xs:col-span-2 sm:col-span-1"
                                        >
                                            <div className="w-11 h-11 rounded-xl bg-indigo-500 flex items-center justify-center">
                                                <FiFileText className="text-white" size={20} />
                                            </div>
                                            <p className="font-semibold text-[#191919] text-sm">FAQs</p>
                                            <p className="text-xs text-[#6B7280]">Frequently asked questions</p>
                                        </a>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Account