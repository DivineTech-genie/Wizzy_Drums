import CTA from "@/components/CTA";
import EventTypes from "@/components/EventTypes";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Stats />
      <HowItWorks />
      <EventTypes />
      <Testimonials />
      <CTA />
    </main>
  );
}
