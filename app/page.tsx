import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyChoose from "@/components/WhyChoose";
import Technologies from "@/components/Technologies";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <HeroSection />
        <About />
        <Services />
        <WhyChoose />
        <Technologies />
        <Portfolio />
        <Process />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
