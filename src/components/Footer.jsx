import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi'
import Logo from './Logo'

const footerColumns = [
    {
        title: 'Shop',
        links: [
            { label: "Men's Clothing", href: '/categories/men' },
            { label: "Women's Clothing", href: '/categories/women' },
            { label: 'Shoes', href: '/categories/shoes' },
            { label: 'Accessories', href: '/categories/accessories' },
            { label: 'Watches', href: '/categories/watches' },
        ],
    },
    {
        title: 'Customer Service',
        links: [
            { label: 'Help Center', href: '/help' },
            { label: 'Track Order', href: '/track-order' },
            { label: 'Returns & Refunds', href: '#', comingSoon: true },
            { label: 'Shipping Info', href: '/shipping-info' },
            { label: 'FAQs', href: '/faq' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers', comingSoon: true },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms & Conditions', href: '/terms' },
            { label: 'Contact Us', href: '/contact' },
        ],
    },
]

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-400">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
                    <div>
                        <Logo dark />
                        <p className="text-sm mt-4 leading-relaxed">
                            Your one-stop destination for fashion, shoes, accessories and everything you need to wear your style.
                        </p>

                        <div className="flex gap-3 mt-6">
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-white-600 hover:scale-110 transition-all duration-300">
                                <FiFacebook size={15} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-white-600 hover:scale-110 transition-all duration-300">
                                <FiTwitter size={15} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-white-600 hover:scale-110 transition-all duration-300">
                                <FiInstagram size={15} />
                            </a>
                        </div>
                    </div>

                    {footerColumns.map((col) => (
                        <div key={col.title}>
                            <p className="font-semibold text-white mb-5 text-sm tracking-wide">{col.title}</p>
                            <ul className="space-y-3 text-sm">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="group inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300"
                                        >
                                            <FiArrowRight size={11} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-400" />
                                            {link.label}
                                            {link.comingSoon && (
                                                <span className="text-[9px] bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded-full">
                                                    Soon
                                                </span>
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <p className="font-semibold text-white mb-5 text-sm tracking-wide">Contact</p>
                        <div className="space-y-3 text-sm">
                            <a href="mailto:wearify.sells@gmail.com" className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
                                <FiMail size={15} className="text-blue-400" />
                                wearify.sells@gmail.com
                            </a>
                            <a href="tel:+8801581270371" className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
                                <FiPhone size={15} className="text-blue-400" />
                                +880 1581-270371
                            </a>
                            <div className="flex items-center gap-2.5">
                                <FiMapPin size={15} className="text-blue-400 shrink-0" />
                                Gulshan, Dhaka, Bangladesh
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-center text-xs">
                    <p>© 2026 Wearify. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer