"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  MapPin,
  Award,
  CheckCircle,
  Clock,
  Music2,
  Plane,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const stats = [
    { icon: Calendar, value: "120+", label: "Events Performed" },
    { icon: Users, value: "15k+", label: "Happy Attendees" },
    { icon: MapPin, value: "30+", label: "Cities Covered" },
    { icon: Award, value: "8+", label: "Years on Stage" },
  ];

  const whyBookUs = [
    {
      icon: Clock,
      title: "Punctual. Prepared. Professional.",
      description:
        "I arrive early, set up fast, and coordinate with your sound team so nothing disrupts the schedule. Every event starts and ends on your timeline.",
    },
    {
      icon: Music2,
      title: "Range That Reads The Room.",
      description:
        "Afrobeat to highlife, gospel to R&B, contemporary pop to classics — every set is tailored to your audience, not a fixed playlist.",
    },
    {
      icon: Plane,
      title: "Logistics Handled End-to-End.",
      description:
        "Local events get ground transport arranged. Out-of-state bookings get flights and accommodation planned in advance. No surprises on the day.",
    },
  ];

  const performanceMoments = [
    {
      title: "Weddings & Receptions",
      description:
        "Elegant intros, soulful grooves, and celebration energy that keeps every generation on the dance floor.",
    },
    {
      title: "Corporate Galas & Launches",
      description:
        "Polished, on-brand performances that elevate award nights, product launches, and executive events.",
    },
    {
      title: "Festivals & Main Stages",
      description:
        "High-energy sets built for large crowds — commanding, dynamic, and unforgettable.",
    },
    {
      title: "Nightclubs & Residencies",
      description:
        "Deep pocket grooves and seamless transitions that keep the floor moving late into the night.",
    },
  ];

  const notableClients = [
    { name: "Eko Hotels & Suites", initial: "E" },
    { name: "Lagos State Government", initial: "L" },
    { name: "MTN Nigeria", initial: "M" },
    { name: "Guinness Nigeria", initial: "G" },
    { name: "Access Bank", initial: "A" },
    { name: "Nigerian Breweries", initial: "N" },
  ];

  return (
    <main className="flex-1 page-top">
      {/* Hero */}
      <section className="relative section bg-linear-to-br from-primary/5 via-background to-background">
        <div className="container-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            About Wizzy
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="heading-xl mb-4"
          >
            The Rhythm Behind <span className="text-primary">The Moment</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-wrap-narrow text-lg"
          >
            A Nigerian drummer and live performer turning events into
            unforgettable experiences, one beat at a time.
          </motion.p>
        </div>
      </section>

      {/* Bio + Image */}
      <section className="section container-content">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              The Story
            </p>
            <h2 className="heading-md mb-6">Meet Wizzy</h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Wizzy is a professional drummer based in Enugu, Nigeria — known
                for a stage presence that pulls audiences in and a rhythm that
                keeps them there. From intimate wedding receptions to headline
                festival stages, every performance is built to be felt, not just
                heard.
              </p>
              <p>
                With over a decade behind the kit, Wizzy has shared stages with
                some of Nigeria&apos;s biggest acts and performed at 120+ events
                across 30 cities — weddings, corporate galas, festivals,
                nightclub residencies, and private celebrations. His playing
                moves fluidly between Afrobeat, highlife, R&amp;B, gospel, and
                contemporary pop, reading the room and matching the energy of
                the moment.
              </p>
              <p>
                Beyond the Playing, it&apos;s the professionalism that keeps
                clients coming back. Punctual arrivals. Clean setups. Seamless
                coordination with sound and production teams. And a genuine
                commitment to making your event feel special from the first
                downbeat to the last.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/book">
                <Button className="gap-2">Book Wizzy</Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" className="gap-2">
                  View Gallery
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-linear-to-br from-primary/20 to-primary/5 shadow-2xl">
              <Image
                src="/images/gallery/performance-1.jpeg"
                alt="Wizzy performing live"
                width={1200}
                height={1200}
                sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 p-3 backdrop-blur-xl dark:bg-slate-950/70">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">5.0 Rating</p>
                  <p className="text-xs text-muted-foreground">
                    From 50+ verified bookings
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-muted/30">
        <div className="container-content">
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

      {/* Why Book Wizzy */}
      <section className="section container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-wrap-narrow mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Why Book Wizzy
          </p>
          <h2 className="heading-md mb-4">Built For Events That Matter</h2>
          <p className="text-muted-foreground">
            Every booking is treated like the headline act — because to your
            guests, it is.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {whyBookUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                <CardContent className="card-pad">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-5">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="heading-card mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Performance Moments */}
      <section className="section bg-muted/30">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-wrap-narrow mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              Signature Sets
            </p>
            <h2 className="heading-md mb-4">A Performance For Every Stage</h2>
            <p className="text-muted-foreground">
              Each event type gets a performance built for it — not a template.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {performanceMoments.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group flex gap-4 rounded-2xl border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="heading-card mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="section container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-wrap-narrow mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
            Clients & Stages
          </p>
          <h2 className="heading-md mb-4">Trusted By The Best</h2>
          <p className="text-muted-foreground">
            From corporate giants to headline festivals — brands that put their
            name on the line choose Wizzy.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border">
          {notableClients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative flex flex-col items-center justify-center gap-3 bg-card p-8 md:p-10 transition-colors duration-300 hover:bg-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/40 text-xl font-heading font-bold text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                {client.initial}
              </div>
              <p className="text-center text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                {client.name}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          + dozens more festivals, private celebrations, and corporate events
          across Nigeria
        </motion.p>
      </section>

      {/* CTA */}
      <section className="section container-content pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/20 via-primary/10 to-background p-8 md:p-16 text-center"
        >
          <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="heading-md mb-4">
              Let&apos;s Make It Unforgettable
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Dates fill up fast during peak season. Check availability and lock
              your event date today.
            </p>
            <Link href="/book">
              <Button size="lg" className="gap-2">
                Check Availability
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
