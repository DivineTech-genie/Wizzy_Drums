import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wizzy Drums | Professional Live Drumming for Events",
  description:
    "Book live drumming for weddings, corporate galas, and festivals across Nigeria. Check availability and lock your date today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
