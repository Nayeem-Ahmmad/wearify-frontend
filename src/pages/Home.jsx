import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Categories from '../components/Categories'
import FlashSale from '../components/FlashSale'
import FeaturedProducts from '../components/FeaturedProducts'
import PromoBanners from '../components/PromoBanners'
import BestSellers from '../components/BestSellers'
import NewArrivals from '../components/NewArrivals'
import BrandPartners from '../components/BrandPartners'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <Hero />
      <Features />
      <Categories />
      <FlashSale />
      <FeaturedProducts />
      <PromoBanners />
      <BestSellers />
      <NewArrivals />
      <BrandPartners />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home