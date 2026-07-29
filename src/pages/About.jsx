import { FiTarget, FiEye, FiHeart, FiUsers } from 'react-icons/fi'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const values = [
    {
        icon: FiTarget,
        title: 'Our Mission',
        desc: 'To make quality fashion accessible and effortless — bringing style, comfort, and confidence to everyone, one order at a time.',
    },
    {
        icon: FiEye,
        title: 'Our Vision',
        desc: 'To become a trusted name in online fashion, known for genuine products, honest service, and a shopping experience people love to return to.',
    },
    {
        icon: FiHeart,
        title: 'Our Values',
        desc: 'Quality over quantity, honesty in every transaction, and putting our customers at the heart of everything we do.',
    },
    {
        icon: FiUsers,
        title: 'Our Promise',
        desc: 'Every product is checked for quality, every order is handled with care, and every customer is treated like family.',
    },
]

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <Navbar />

            <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-block text-sm font-semibold text-blue-600 tracking-widest mb-3">
                        OUR STORY
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5">
                        Wear Your Style
                    </h1>
                    <p className="text-slate-600 leading-relaxed">
                        Wearify began with a simple idea — everyone deserves to look and feel their best,
                        without compromising on quality or paying more than they should. What started as
                        a small passion for fashion grew into a mission: to build an online store where
                        people could shop with confidence, knowing every product is genuine and every
                        order is handled with care.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-4">
                        Today, Wearify is more than just a clothing store. It's a growing community of
                        people who believe that style is personal, and everyone deserves access to fashion
                        that fits their life, their budget, and their identity.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-6">
                    {values.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 hover:scale-110 transition-transform duration-300">
                                <Icon size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-slate-950 text-white py-14">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-3">Join the Wearify Family</h2>
                    <p className="text-slate-400 mb-6">
                        Explore our collection and discover fashion that speaks to who you are.
                    </p>
                    <a
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3 rounded-full font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                    >
                        Start Shopping
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default About