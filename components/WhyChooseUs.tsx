"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles, Users2 } from "lucide-react";

const benefits = [
  {
    title: "Curated talent collections",
    description:
      "We pair your event with performers and production teams that fit the tone, audience, and venue perfectly.",
    icon: CheckCircle2,
  },
  {
    title: "Streamlined planning",
    description:
      "From first inquiry to final encore, we coordinate logistics, timelines, and technical details so you can stay focused.",
    icon: Users2,
  },
  {
    title: "Transparent pricing",
    description:
      "No hidden fees. Every quote is built around your production needs, travel, and performance requirements.",
    icon: ShieldCheck,
  },
  {
    title: "Premium event impact",
    description:
      "Designed to elevate your brand, create memorable moments, and keep guests talking long after the night ends.",
    icon: Sparkles,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding container-custom">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background/80 p-10 shadow-xl shadow-slate-900/5">
        <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.32em] text-primary/80 mb-4">
              Why event teams choose us
            </p>
            <h2 className="heading-lg mb-6">
              A premium booking experience with real event support behind it.
            </h2>
            <p className="text-muted-foreground leading-7">
              We deliver more than great performances — we deliver thoughtful
              production, on-time execution, and a guest experience that feels
              effortless from the first call.
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
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    {benefit.title}
                  </h3>
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
