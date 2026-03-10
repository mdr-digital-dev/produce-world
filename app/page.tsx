"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Specialties from "@/components/Specialties";
import Reviews from "@/components/Reviews";
import VisitUs from "@/components/VisitUs";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        style={{
          height: "1px",
          backgroundColor: "#B85C38",
          opacity: 0.35,
          originX: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Specialties />
        <SectionDivider />
        <Reviews />
        <SectionDivider />
        <VisitUs />
        <SectionDivider />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
