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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-16 text-center"
      >
        <h2 className="heading-md mb-4">Ready to Book Your Event?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
          Let&apos;s bring your vision to life. Get a personalized quote today.
        </p>
        <Button size="lg" className="gap-2">
          <Link href="/book">
            Get Your Quote Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default CTA;
