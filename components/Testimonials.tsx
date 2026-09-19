"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah O.",
      role: "Wedding Planner, Lagos",
      quote:
        "The drumming carried the whole reception. The energy was electric, and our guests are still talking about it months later.",
      rating: 5,
    },
    {
      name: "Michael A.",
      role: "Corporate Events Director",
      quote:
        "Professional from start to finish. The booking process was seamless, and the performance was world-class.",
      rating: 5,
    },
    {
      name: "Chinwe E.",
      role: "Festival Organizer, Abuja",
      quote:
        "One of the best live drummers we've ever booked. Crowd engagement was incredible. Will definitely book again.",
      rating: 5,
    },
  ];

  return (
    <section className="section bg-primary/5">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="heading-lg mb-4">What clients say</h2>
          <p className="text-muted-foreground">
            Real feedback from event organizers who&apos;ve booked live
            drumming.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full rounded-[2rem] border border-border bg-background shadow-sm transition-shadow hover:shadow-lg">
                <CardContent className="card-pad flex flex-col h-full">
                  <div className="flex items-center gap-1 text-primary mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm italic flex-1 leading-7">
                    {testimonial.quote}
                  </p>
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
