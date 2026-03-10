"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { SPECIALTIES } from "@/lib/constants";

export default function Specialties() {
  return (
    <section id="specialties" className="bg-ivory py-16 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#B85C38" }} />
            <span
              className="font-dm-sans text-xs tracking-widest uppercase"
              style={{ color: "#B85C38", letterSpacing: "0.22em" }}
            >
              What We Carry
            </span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#B85C38" }} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-cormorant font-semibold leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 60px)", color: "#2C3B2D" }}
          >
            What We Specialize In
          </motion.h2>
        </motion.div>

        {/* 2×2 Card Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {SPECIALTIES.map((specialty) => (
            <SpecialtyCard key={specialty.id} specialty={specialty} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SpecialtyCard({
  specialty,
}: {
  specialty: (typeof SPECIALTIES)[number];
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden cursor-pointer"
      style={{ height: "clamp(260px, 40vw, 400px)" }}
    >
      {/* Image */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
        <Image
          src={`https://images.unsplash.com/photo-${specialty.imageId}?auto=format&fit=crop&w=900&q=90`}
          alt={specialty.title}
          fill
          className="object-cover"
          style={{ filter: "brightness(0.85) saturate(1.1)" }}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background:
            "linear-gradient(to top, rgba(26,26,26,0.88) 0%, rgba(26,26,26,0.4) 50%, transparent 100%)",
        }}
      />

      {/* Hover overlay darkening */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "rgba(44,59,45,0.25)" }}
      />

      {/* Gold border on hover */}
      <div
        className="absolute inset-0 border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ borderColor: "#C9A84C" }}
      />

      {/* Tag */}
      <div
        className="absolute top-5 right-5 px-3 py-1"
        style={{ backgroundColor: "#B85C38" }}
      >
        <span
          className="font-dm-sans text-xs tracking-widest uppercase"
          style={{ color: "#FDFAF4", fontSize: "9px", letterSpacing: "0.18em" }}
        >
          {specialty.tag}
        </span>
      </div>

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8">
        <h3
          className="font-cormorant font-light text-ivory mb-3 leading-tight"
          style={{ fontSize: "clamp(26px, 3vw, 34px)" }}
        >
          {specialty.title}
        </h3>
        <p
          className="font-dm-sans font-light text-ivory opacity-80 leading-relaxed transition-all duration-300"
          style={{ fontSize: "13px", lineHeight: "1.75", maxWidth: "320px" }}
        >
          {specialty.description}
        </p>
      </div>
    </motion.div>
  );
}
