"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mic2,
  Users,
  Calendar,
  MapPin,
  Download,
  FileText,
  Award,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  const stats = [
    { icon: Calendar, value: "120+", label: "Events Performed" },
    { icon: Users, value: "15,000+", label: "Audience Members" },
    { icon: MapPin, value: "30+", label: "Cities Performed" },
    { icon: Award, value: "5", label: "Industry Awards" },
  ];

  const notableClients = [
    "Eko Hotels & Suites",
    "Lagos State Government",
    "MTN Nigeria",
    "Guinness Nigeria",
    "Access Bank",
    "Nigerian Breweries",
  ];

  const techRiderItems = [
    "Professional PA System (min. 10kW)",
    "Monitor Wedges (x4)",
    "Mixing Console (Digital preferred)",
    "Microphone Package (Shure/ Sennheiser)",
    "Stage Lighting (LED wash + spots)",
    "Backline: Keyboard, Guitar, Bass Amp",
    "Drum Kit (with cymbals)",
    "Power Conditioners & Cabling",
  ];

  return (
    <main className="flex-1 pt-20">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to from-primary/5 via-background to-background">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-xl mb-4"
          >
            About the Artist
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Passionate performer bringing energy, creativity, and world-class entertainment to every stage.
          </motion.p>
        </div>
      </section>

      {/* Bio + Image */}
      <section className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <h2 className="heading-md mb-4">Who We Are</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We are a professional live performance collective based in Nigeria, dedicated to
                delivering unforgettable experiences across weddings, corporate galas, festivals, and
                nightclub events.
              </p>
              <p>
                With over a decade of stage experience, we&apos;ve performed for thousands of guests
                across 30+ cities nationwide. Our repertoire spans Afrobeat, R&B, highlife, and
                contemporary pop — tailored to your event&apos;s vibe.
              </p>
              <p>
                We pride ourselves on seamless logistics, punctual execution, and genuine audience
                connection. From intimate gatherings to large-scale festivals, we bring the energy
                that makes events memorable.
              </p>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <Button className="gap-2">
                <Link href="/book">Book Now</Link>
              </Button>
              <Button variant="outline" className="gap-2">
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to from-primary/20 to-primary/5 flex items-center justify-center shadow-xl">
              <div className="text-center">
                <Mic2 className="h-24 w-24 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Artist Photo Placeholder</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-heading font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Kit & Tech Rider */}
      <section className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Press Kit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold mb-2">Press Kit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download our complete press kit including bio, high-res photos, and media assets for
                  event promotion.
                </p>
                <Button className="gap-2">
                  <a href="/press-kit.pdf" download>
                    <Download className="h-4 w-4" />
                    Download Press Kit
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tech Rider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold mb-2">Tech Rider</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download our technical rider with stage requirements, PA specs, and equipment list
                  for seamless event production.
                </p>
                <Button className="gap-2" variant="outline">
                  <a href="/tech-rider.pdf" download>
                    <Download className="h-4 w-4" />
                    Download Tech Rider
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Rider Detail (expanded) */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="heading-md text-center mb-8">Technical Requirements</h2>
            <Card>
              <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {techRiderItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Full detailed rider available in the downloadable PDF.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notable Clients */}
      <section className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="heading-md mb-4">Trusted By</h2>
          <p className="text-muted-foreground">We&apos;ve performed for these prestigious organizations and events.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {notableClients.map((client) => (
            <Badge key={client} variant="secondary" className="px-4 py-2 text-sm">
              {client}
            </Badge>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-custom pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-linear-to from-primary/20 via-primary/10 to-background p-8 md:p-16 text-center"
        >
          <h2 className="heading-md mb-4">Ready to Book?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Let&apos;s create an unforgettable experience for your next event.
          </p>
          <Button size="lg" className="gap-2">
            <Link href="/book">Get Your Quote</Link>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}