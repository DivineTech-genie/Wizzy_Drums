import CTA from "@/components/CTA";
import EventTypes from "@/components/EventTypes";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="flex-1">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <EventTypes />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
