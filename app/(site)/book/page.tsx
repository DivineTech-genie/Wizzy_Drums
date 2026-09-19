import type { Metadata } from "next";
import { MainBooking } from "@/components/booking/MainBooking";

export const metadata: Metadata = {
  title: "Book a Drummer | Wizzy Drums Availability",
  description:
    "Request a booking for your event with Wizzy Drums. Share your event details, logistics, and preferred performance requirements.",
};

const Book = () => {
  return (
    <div className="page-top bg-background text-foreground">
      <MainBooking />
    </div>
  );
};

export default Book;
