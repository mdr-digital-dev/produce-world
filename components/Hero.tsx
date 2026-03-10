"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { STORE } from "@/lib/constants";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxY = scrollY * 0.4;

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "700px" }}
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 scale-110"
        style={{ transform: `translateY(${parallaxY}px) scale(1.1)` }}
      >
        <Image
          src="https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&w=1800&q=90"
          alt="Colorful fresh produce market overhead view"
          fill
          priority
          className="object-cover"
          style={{
            filter: "brightness(0.6) saturate(1.2)",
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(26,26,26,0.3) 0%, rgba(44,59,45,0.5) 60%, rgba(26,26,26,0.7) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          className="font-dm-sans text-xs tracking-widest uppercase mb-8"
          style={{ color: "rgba(201,168,76,0.9)", letterSpacing: "0.28em" }}
        >
          Est. {STORE.established} &nbsp;·&nbsp; Albany Park, Chicago
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          variants={fadeUp}
          className="font-cormorant font-light italic text-ivory leading-[0.95] mb-8"
          style={{ fontSize: "clamp(56px, 10vw, 112px)" }}
        >
          Thirty Years of
          <br />
          <span style={{ color: "#C9A84C" }}>Freshness.</span>
        </motion.h1>

        {/* Gold Rule */}
        <motion.div
          variants={fadeUp}
          className="mb-8"
          style={{ width: "80px", height: "1px", backgroundColor: "#C9A84C" }}
        />

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          className="font-dm-sans font-light tracking-widest uppercase text-ivory mb-12 max-w-sm"
          style={{ fontSize: "11px", letterSpacing: "0.22em", opacity: 0.85 }}
        >
          Chicago&apos;s Premier International Produce Market
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <a
            href="#specialties"
            className="btn-fill font-dm-sans text-xs tracking-widest uppercase px-10 py-4 border border-ivory text-ivory transition-colors duration-300 hover:text-charcoal"
            style={{ letterSpacing: "0.2em" }}
          >
            Explore Our Market ↓
          </a>
          <a
            href={STORE.address.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm-sans text-xs tracking-widest uppercase px-10 py-4 transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: "#B85C38",
              color: "#FDFAF4",
              letterSpacing: "0.2em",
            }}
          >
            Get Directions
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce-slow">
        <span
          className="font-dm-sans text-xs tracking-widest uppercase"
          style={{ color: "rgba(201,168,76,0.7)", letterSpacing: "0.2em", fontSize: "9px" }}
        >
          Scroll
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
