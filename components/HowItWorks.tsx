"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, CheckCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      icon: Calendar,
      title: "Submit Your Event Details",
      description:
        "Tell us your date, venue, and performance requirements. We'll handle the logistics.",
    },
    {
      icon: Quote,
      title: "Review Your Custom Quote",
      description:
        "Get a transparent, itemized quote including performance fee, travel, and accommodation.",
    },
    {
      icon: CheckCircle,
      title: "Confirm & Lock Your Date",
      description:
        "Sign the agreement and secure your date with a deposit. Your event is officially booked!",
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="heading-lg mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            Three simple steps to book world-class entertainment for your event.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
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
              <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 pt-6">
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
          <Button size="lg" className="gap-2">
            <Link href="/book">
              Start Your Booking
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
