"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GALLERY_IMAGES } from "@/lib/constants";

export default function Gallery() {
  return (
    <section className="w-full overflow-hidden bg-charcoal">
      {/* Section label */}
      <div className="text-center py-10" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="flex items-center justify-center gap-3 mb-2">
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

      {/* Photo Strip */}
      <div className="flex overflow-x-auto md:overflow-x-hidden" style={{ height: "320px", scrollbarWidth: "none" }}>
        <motion.div
          className="flex flex-shrink-0"
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
          style={{ width: "max-content" }}
        >
          {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, i) => (
            <GalleryItem key={i} img={img} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function GalleryItem({
  img,
  index,
}: {
  img: { id: string; alt: string };
  index: number;
}) {
  return (
    <div
      className="group relative flex-shrink-0 overflow-hidden"
      style={{
        width: "clamp(200px, 18vw, 320px)",
        height: "320px",
      }}
    >
      <Image
        src={`https://images.unsplash.com/photo-${img.id}?auto=format&fit=crop&w=600&q=85`}
        alt={img.alt}
        fill
        className="object-cover transition-all duration-700 group-hover:brightness-110 group-hover:saturate-110"
        style={{ filter: "brightness(0.88) saturate(1.05)" }}
        loading={index < 3 ? "eager" : "lazy"}
      />

      {/* Gold overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: "rgba(201,168,76,0.12)" }}
      />

      {/* Caption on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-400"
        style={{ backgroundColor: "rgba(44,59,45,0.85)" }}
      >
        <p
          className="font-dm-sans text-xs tracking-widest uppercase"
          style={{ color: "#C9A84C", letterSpacing: "0.16em", fontSize: "9px" }}
        >
          {img.alt}
        </p>
      </div>
    </div>
  );
}
