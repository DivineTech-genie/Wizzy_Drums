"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedia } from "@/hooks/useMedia";
import { HeroVideoSkeleton } from "@/components/ui/ContentSkeleton";

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const { getHeroVideo, isLoading } = useMedia();
  const heroVideo = getHeroVideo();

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="relative min-h-screen md:py-12 flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(114,113,253,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(38,198,218,0.14),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background/95 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 600 600"
          className="absolute left-[10%] top-[8%] opacity-20"
          style={{ height: "24rem", width: "24rem" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="300"
            cy="300"
            r="180"
            stroke="rgba(114,113,253,0.2)"
            strokeWidth="16"
          />
          <path
            d="M 150 90 C 210 200 390 100 450 210"
            stroke="rgba(38,198,218,0.15)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 120 460 C 180 340 420 500 480 380"
            stroke="rgba(114,113,253,0.14)"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <motion.div
        className="container-custom relative z-10 pt-20"
        style={{ y }}
      >
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm mb-6"
            >
              <Star className="h-4 w-4 fill-primary" />
              Professional live event talent
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-xl text-balance mb-6"
            >
              Turning every event into a
              <span className="text-primary block">
                memorable live experience
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl leading-8 mb-8"
            >
              From weddings and corporate launches to festivals and private
              celebrations — we bring world-class performances, seamless
              logistics, and unforgettable production value.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/book">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/10">
                  Check Availability
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#featured">
                <Button size="lg" variant="outline" className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Reel
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 grid gap-4 sm:grid-cols-3 text-sm"
            >
              {[
                {
                  label: "100+ events",
                  icon: <CheckCircle className="h-4 w-4 text-primary" />,
                },
                {
                  label: "5-star reviews",
                  icon: <CheckCircle className="h-4 w-4 text-primary" />,
                },
                {
                  label: "Nationwide coverage",
                  icon: <CheckCircle className="h-4 w-4 text-primary" />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-3xl border border-border bg-background/80 px-4 py-3 shadow-sm"
                >
                  {item.icon}
                  <span className="font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {isLoading ? (
              <HeroVideoSkeleton />
            ) : heroVideo?.src ? (
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-slate-950/80 shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="h-full w-full object-cover md:h-130"
                  poster={heroVideo.thumbnail}
                >
                  <source src={heroVideo.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_34%)]" />

                <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm">
                  Live preview
                </div>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/65 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-900/80"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-slate-950/80 shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="h-full w-full object-cover md:h-130"
                >
                  <source src="/video/hero-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_34%)]" />

                <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm">
                  Live preview
                </div>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/65 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-900/80"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 left-6 rounded-[2rem] border border-white/20 bg-white/90 p-4 shadow-2xl backdrop-blur-xl dark:bg-slate-950/70"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full bg-primary/20 ring-2 ring-background"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Trusted by event planners
                  </p>
                  <p className="text-xs text-muted-foreground">
                    50+ high-profile bookings
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
