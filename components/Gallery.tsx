"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_IMAGES } from "@/lib/constants";

export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = GALLERY_IMAGES.length;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 5s
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);


  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" as const },
    }),
  };

  const getUrl = (id: string) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=95`;

  return (
    <section className="w-full" style={{ backgroundColor: "#1A1A1A" }}>
      {/* Section Label */}
      <div className="text-center py-10" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-px" style={{ backgroundColor: "#C9A84C", opacity: 0.5 }} />
          <span
            className="font-dm-sans text-xs tracking-widest uppercase"
            style={{ color: "#B85C38", letterSpacing: "0.22em" }}
          >
            Fresh Every Day
          </span>
          <div className="w-16 h-px" style={{ backgroundColor: "#C9A84C", opacity: 0.5 }} />
        </div>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden w-full"
        style={{ height: "clamp(300px, 55vw, 650px)" }}
      >
        {/* Preload all images off-screen */}
        <div className="hidden">
          {GALLERY_IMAGES.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={getUrl(img.id)} alt="" />
          ))}
        </div>

        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getUrl(GALLERY_IMAGES[current].id)}
              alt={GALLERY_IMAGES[current].alt}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.82) saturate(1.15)" }}
            />

            {/* Bottom gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(26,26,26,0.75) 0%, transparent 55%)",
              }}
            />

            {/* Caption */}
            <div className="absolute bottom-8 left-0 right-0 text-center px-6">
              <p
                className="font-dm-sans uppercase tracking-widest"
                style={{ color: "#C9A84C", fontSize: "10px", letterSpacing: "0.26em" }}
              >
                {GALLERY_IMAGES[current].alt}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            width: "48px",
            height: "48px",
            border: "1.5px solid rgba(201,168,76,0.6)",
            borderRadius: "50%",
            backgroundColor: "rgba(26,26,26,0.55)",
            color: "#C9A84C",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            width: "48px",
            height: "48px",
            border: "1.5px solid rgba(201,168,76,0.6)",
            borderRadius: "50%",
            backgroundColor: "rgba(26,26,26,0.55)",
            color: "#C9A84C",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
          {GALLERY_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              aria-label={`Go to photo ${i + 1}`}
              style={{
                width: i === current ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor:
                  i === current ? "#C9A84C" : "rgba(201,168,76,0.35)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <div
          className="absolute top-5 right-5 z-10 font-dm-sans"
          style={{
            color: "rgba(201,168,76,0.75)",
            fontSize: "11px",
            letterSpacing: "0.1em",
          }}
        >
          {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}
