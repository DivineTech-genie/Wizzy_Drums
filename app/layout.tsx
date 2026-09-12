import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Your Performance | Professional Drummer Booking",
  description:
    "Book professional performances for weddings, corporate events, festivals, and nightclubs. Get a quote today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
