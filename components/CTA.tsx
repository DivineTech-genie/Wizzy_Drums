"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="section-padding container-custom">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-linear-to-br from-primary/15 via-background to-background p-8 md:p-16 text-center shadow-lg"
      >
        <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-full bg-secondary/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10">
          <h2 className="heading-md mb-4">Ready to elevate your next event?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-8">
            Share your event goals and we&apos;ll design an entertainment
            package that makes every moment unforgettable.
          </p>
          <Link href="/book" className="inline-flex justify-center">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/10">
              Get Your Quote Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { label: "Tailored packages", accent: "bg-primary/10" },
              { label: "Fast response", accent: "bg-secondary/10" },
              { label: "Transparent pricing", accent: "bg-primary/10" },
              { label: "Dedicated support", accent: "bg-secondary/10" },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-3xl border border-border ${item.accent} px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
