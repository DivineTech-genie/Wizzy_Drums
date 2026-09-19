"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, CheckCircle, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      icon: Calendar,
      title: "Submit Your Event Details",
      description:
        "Tell me your date, venue, and what you need from the performance. I'll handle the logistics.",
    },
    {
      icon: Receipt,
      title: "Review Your Custom Quote",
      description:
        "Get a transparent, itemized quote covering the performance fee, travel, and any accommodation.",
    },
    {
      icon: CheckCircle,
      title: "Confirm & Lock Your Date",
      description:
        "Sign the agreement and secure your date with a deposit. Your performance is officially booked.",
    },
  ];

  return (
    <section className="section bg-muted/30">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="heading-lg mb-4">How it works</h2>
          <p className="text-muted-foreground">
            One smooth process from inquiry to performance built for busy
            event teams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-0.5 bg-primary/20 -translate-y-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="h-full rounded-[2rem] border border-border bg-background shadow-sm transition-shadow hover:shadow-lg">
                <CardContent className="card-pad pt-8 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 mb-5 mx-auto">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="heading-card mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-7">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/book">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/10">
              Start Your Booking
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
