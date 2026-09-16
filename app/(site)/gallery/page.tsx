// app/gallery/page.tsx
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Wizzy Drums| Performance Gallery ",
  description:
    "View stunning performance photos and videos from weddings, corporate events, festivals, and nightclubs across Nigeria.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="container-custom mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="heading-lg mb-4">Performance Gallery</h1>
          <p className="text-muted-foreground">
            Explore highlights from past performances across Nigeria. See the
            energy, the crowd, and the stage presence that defines the
            experience.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container-custom">
        <GalleryGrid />
      </div>

      {/* CTA */}
      <div className="container-custom mt-16">
        <div className="rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12 text-center">
          <h2 className="heading-md mb-3">Ready to Book?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            See something you like? Let&apos;s create an unforgettable
            experience for your event.
          </p>
          <Button size="lg" className="gap-2 mx-auto ">
            <Link href="/book" className="flex items-center gap-2">
              Check Availability
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
