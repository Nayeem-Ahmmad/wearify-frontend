import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-6 gap-8">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="text-sm text-slate-400 mt-3">
            Your one-stop destination for fashion, shoes, accessories and everything you need.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300">
              <FiFacebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300">
              <FiInstagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300">
              <FiTwitter size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white mb-3 text-sm">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/categories/men" className="hover:text-white transition-colors duration-300">Men's Clothing</a></li>
            <li><a href="/categories/women" className="hover:text-white transition-colors duration-300">Women's Clothing</a></li>
            <li><a href="/categories/shoes" className="hover:text-white transition-colors duration-300">Shoes</a></li>
            <li><a href="/categories/accessories" className="hover:text-white transition-colors duration-300">Accessories</a></li>
            <li><a href="/categories/watches" className="hover:text-white transition-colors duration-300">Watches</a></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3 text-sm">Customer Service</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/help" className="hover:text-white transition-colors duration-300">Help Center</a></li>
            <li><a href="/track-order" className="hover:text-white transition-colors duration-300">Track Order</a></li>
            <li className="relative group cursor-pointer hover:text-white transition-colors duration-300">
              Returns &amp; Refunds
              <span className="ml-1.5 text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">Coming Soon</span>
            </li>
            <li><a href="/shipping-info" className="hover:text-white transition-colors duration-300">Shipping Info</a></li>
            <li><a href="/faq" className="hover:text-white transition-colors duration-300">FAQs</a></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3 text-sm">Company</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white transition-colors duration-300">About Us</a></li>
            <li><a href="/careers" className="hover:text-white transition-colors duration-300">Careers</a></li>
            <li><a href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white transition-colors duration-300">Terms &amp; Conditions</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3 text-sm">Contact Us</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FiMapPin size={15} className="mt-0.5 text-blue-400 shrink-0" />
              <span>Gulshan, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone size={15} className="text-blue-400 shrink-0" />
              <a href="tel:+8801581270371" className="hover:text-white transition-colors duration-300">
                +880 1581-270371
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FiMail size={15} className="text-blue-400 shrink-0" />
              <a href="mailto:wearify.sells@gmail.com" className="hover:text-white transition-colors duration-300">
                wearify.sells@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Wearify. All rights reserved.</p>
          <div className="flex gap-3 items-center">
            <span>We Accept:</span>
            {['VISA', 'MASTERCARD', 'AMEX', 'bKash', 'Nagad'].map((p) => (
              <span
                key={p}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition-all duration-300"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer