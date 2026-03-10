"use client";

import { useEffect, useRef } from "react";
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
  // Custom cursor — desktop only
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    let raf: number;
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      raf = requestAnimationFrame(animateRing);
    };
    animateRing();

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
      dot.remove();
      ring.remove();
    };
  }, []);

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
