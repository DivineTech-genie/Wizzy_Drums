import type { Metadata } from "next";
import ContactPage from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact Wizzy Drums | Book Your Event",
  description:
    "Get in touch with Wizzy Drums to enquire about bookings, event details, pricing, and availability for your next performance.",
};

const Contact = () => {
  return (
    <div>
      <ContactPage />
    </div>
  );
};

export default Contact;
