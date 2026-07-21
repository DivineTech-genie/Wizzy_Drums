"use client";

import { motion } from "framer-motion";

const EventTypes = () => {
  const types = [
    { label: "Wedding", icon: "💍" },
    { label: "Nightclub", icon: "🎧" },
    { label: "Corporate", icon: "🏢" },
    { label: "Festival", icon: "🎪" },
  ];

  return (
    <section className="section-padding container-custom">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <h2 className="heading-lg mb-4">Every Event, Elevated</h2>
        <p className="text-muted-foreground">
          From intimate gatherings to large-scale productions — we bring the
          energy.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {types.map((type, index) => (
          <motion.div
            key={type.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-xl p-6 text-center bg-card border hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {type.icon}
            </div>
            <p className="font-medium">{type.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default EventTypes;
