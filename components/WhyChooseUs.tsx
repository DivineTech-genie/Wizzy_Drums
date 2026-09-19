"use client";

import { motion } from "framer-motion";
import { Drum, Clock4, ShieldCheck, Sparkles } from "lucide-react";

const benefits = [
  {
    title: "Live drumming, tailored to your event",
    description:
      "Every set is built around your venue, audience, and the energy you want in the room from intimate receptions to packed stages.",
    icon: Drum,
  },
  {
    title: "Punctual, prepared, professional",
    description:
      "I arrive early, set up fast, and coordinate with your sound and production team so the schedule runs without a hitch.",
    icon: Clock4,
  },
  {
    title: "Transparent pricing, no surprises",
    description:
      "Every quote is itemized performance fee, travel, and any logistics so you know exactly what you're paying for.",
    icon: ShieldCheck,
  },
  {
    title: "A rhythm guests remember",
    description:
      "Built to elevate the moment, move the room, and leave your guests talking about the performance long after the night ends.",
    icon: Sparkles,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section container-content">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background/80 p-8 md:p-10 shadow-xl shadow-slate-900/5">
        <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.32em] text-primary/80 mb-4">
              Why event teams book
            </p>
            <h2 className="heading-lg mb-6">
              Professional drumming with real event experience behind it.
            </h2>
            <p className="text-muted-foreground leading-7">
              More than a performance a drummer who shows up prepared, plays
              to the room, and delivers a moment your guests feel from the first
              beat to the last.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="rounded-[1.75rem] border border-border bg-white/90 p-6 shadow-sm shadow-primary/5 dark:bg-slate-950/70"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-primary/10 mb-4 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="heading-card mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
