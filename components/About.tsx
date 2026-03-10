"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { slideInLeft, fadeUp, staggerContainer } from "@/lib/animations";

export default function About() {
  return (
    <section id="about" className="relative bg-cream py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-0 items-center">
          {/* Image — left, 60% width */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative"
            style={{ height: "620px" }}
          >
            <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: "0 0 80px 0" }}>
              <Image
                src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=90"
                alt="Family hands sorting fresh produce at the market"
                fill
                className="object-cover"
                style={{
                  filter: "brightness(0.95) saturate(1.1) sepia(8%)",
                }}
              />
              {/* Warm color overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, rgba(185,92,56,0.08) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Floating stat badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute bottom-10 -right-5 lg:-right-10 bg-forest p-8 text-center z-10"
              style={{ boxShadow: "0 20px 60px rgba(44,59,45,0.3)" }}
            >
              <p
                className="font-cormorant italic text-6xl font-light leading-none"
                style={{ color: "#C9A84C" }}
              >
                30+
              </p>
              <p
                className="font-dm-sans text-xs tracking-widest uppercase mt-2"
                style={{ color: "#F5F0E8", opacity: 0.8, letterSpacing: "0.18em" }}
              >
                Years of Service
              </p>
            </motion.div>
          </motion.div>

          {/* Text — right, with gold vertical line */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative pl-10 lg:pl-16 pt-10 lg:pt-0"
          >
            {/* Vertical gold line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ backgroundColor: "#C9A84C", opacity: 0.4 }}
            />

            {/* Section label */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#B85C38" }}
              />
              <span
                className="font-dm-sans text-xs tracking-widest uppercase"
                style={{ color: "#B85C38", letterSpacing: "0.22em" }}
              >
                Our Story
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-cormorant font-semibold leading-tight mb-8"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)", color: "#2C3B2D" }}
            >
              The Heartbeat of
              <br />
              Albany Park
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="font-dm-sans font-light mb-5 text-charcoal"
              style={{ lineHeight: "1.85", fontSize: "15px" }}
            >
              For over thirty years, our family has been the heartbeat of Albany Park&apos;s
              international food community. What started as a small stand has grown into
              Chicago&apos;s most beloved source for Mediterranean, Greek, Italian, Serbian,
              and Balkan specialty produce.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="font-playfair italic mb-5"
              style={{ color: "#B85C38", fontSize: "17px", lineHeight: "1.75" }}
            >
              &ldquo;We believe food is memory. When a customer walks in and asks for something
              they haven&apos;t tasted since leaving home, we make it our mission to find it.&rdquo;
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="font-dm-sans font-light text-charcoal mb-10"
              style={{ lineHeight: "1.85", fontSize: "15px" }}
            >
              Our shelves are restocked based on your requests, your stories, and your
              traditions. Every item we carry has a reason.
            </motion.p>

            <motion.a
              variants={fadeUp}
              href="#specialties"
              className="animated-link font-dm-sans text-xs tracking-widest uppercase inline-flex items-center gap-3"
              style={{ color: "#2C3B2D", letterSpacing: "0.2em" }}
            >
              Explore Our Specialties
              <span className="text-gold">→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
