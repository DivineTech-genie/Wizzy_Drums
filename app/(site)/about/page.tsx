import type { Metadata } from "next";
import AboutPage from "@/components/About";

export const metadata: Metadata = {
  title: "About Wizzy Drums | Nigeria's Event Drummer Team",
  description:
    "Learn about Wizzy Drums, our performance style, and the experience we bring to weddings, corporate gatherings, festivals, and nightlife events.",
};

const About = () => {
  return (
    <div>
      <AboutPage />
    </div>
  );
};

export default About;
