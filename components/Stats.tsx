"use client";

import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Star } from "lucide-react";

const Stats = () => {
  const stats = [
    { icon: Calendar, value: "120+", label: "Events Performed" },
    { icon: Users, value: "15k+", label: "Happy Attendees" },
    { icon: MapPin, value: "30+", label: "Cities Covered" },
    { icon: Star, value: "4.9", label: "Average Rating" },
  ];

  return (
    <section className="section-padding container-custom">
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
            <p className="text-3xl md:text-4xl font-heading font-bold">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
