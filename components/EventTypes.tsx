"use client";

import { useEvents } from "@/hooks/useEvents";
import { motion } from "framer-motion";
import Image from "next/image";
import { EventCardsSkeleton } from "@/components/ui/ContentSkeleton";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const EventTypes = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <section className="section container-content">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Event types
          </p>
          <h2 className="heading-lg">Performances for every event</h2>
        </div>
        <EventCardsSkeleton count={4} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="section container-content">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
          I couldn&apos;t load the latest event types right now.
        </div>
      </section>
    );
  }

  return (
    <section className="section container-content">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-4">
          Event types
        </p>
        <h2 className="heading-lg">Performances for every event</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {events.map((type) => (
          <motion.div
            key={type._id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <Image
              src={type.src}
              alt={type.label}
              width={400}
              height={300}
              className="h-60 w-full object-cover"
            />
            <div className="stack-sm p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="heading-card">{type.label}</h3>
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(type.price)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default EventTypes;
