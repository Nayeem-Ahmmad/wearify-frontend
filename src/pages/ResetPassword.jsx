import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import { confirmPasswordReset } from '../api/auth'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const uid = searchParams.get('uid')
    const token = searchParams.get('token')

    const [form, setForm] = useState({ password: '', confirmPassword: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)
        try {
            await confirmPasswordReset(uid, token, form.password)
            setDone(true)
        } catch (err) {
            setError(err.response?.data?.error || 'This reset link is invalid or expired')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />
            <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-16">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                    <div className="flex justify-center mb-6">
                        <Logo />
                    </div>

                    {!uid || !token ? (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                                <FiXCircle className="text-red-500" size={28} />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 mb-2">Invalid Link</h1>
                            <p className="text-sm text-slate-500 mb-6">This password reset link is missing required information.</p>
                            <a href="/forgot-password" className="text-blue-600 font-medium hover:underline text-sm">
                                Request a new link
                            </a>
                        </div>
                    ) : done ? (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                                <FiCheckCircle className="text-green-500" size={28} />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 mb-2">Password Reset!</h1>
                            <p className="text-sm text-slate-500 mb-6">Your password has been changed successfully.</p>
                            <a
                                href="/login"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
                            >
                                Sign In
                            </a>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Set New Password</h1>
                            <p className="text-sm text-slate-500 text-center mb-8">Choose a new password for your account</p>

                            {error && (
                                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="New Password"
                                        required
                                        className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.confirmPassword}
                                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                        placeholder="Confirm New Password"
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ResetPassword