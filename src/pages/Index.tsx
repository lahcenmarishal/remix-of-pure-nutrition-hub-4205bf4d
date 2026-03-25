import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PromoCarousel from "@/components/PromoCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PromoCarousel />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <BlogSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
