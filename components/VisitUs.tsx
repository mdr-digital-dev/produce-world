"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp, slideInLeft, slideInRight } from "@/lib/animations";
import { STORE } from "@/lib/constants";

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function VisitUs() {
  return (
    <section id="visit" className="bg-cream py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section label */}
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
              Find Us
            </span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#B85C38" }} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-cormorant font-semibold"
            style={{ fontSize: "clamp(34px, 5vw, 56px)", color: "#2C3B2D" }}
          >
            Visit Us
          </motion.h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-0 relative">
          {/* Map */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative overflow-hidden"
            style={{ height: "520px" }}
          >
            <iframe
              src={STORE.address.embedUrl}
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: "sepia(20%) saturate(110%) hue-rotate(10deg) brightness(0.95)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Produce World location map"
            />
          </motion.div>

          {/* Vertical gold divider — desktop only */}
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px z-10"
            style={{ backgroundColor: "rgba(201,168,76,0.3)", transform: "translateX(-50%)" }}
          />

          {/* Store Info */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col justify-center pl-0 lg:pl-16 pt-12 lg:pt-0"
            style={{ height: "520px" }}
          >
            {/* Address */}
            <div className="flex gap-4 mb-8">
              <div className="flex-shrink-0 pt-0.5">
                <MapPinIcon />
              </div>
              <div>
                <p className="font-dm-sans text-xs tracking-widest uppercase mb-1" style={{ color: "#B85C38", letterSpacing: "0.18em" }}>
                  Address
                </p>
                <p className="font-cormorant text-lg font-light" style={{ color: "#2C3B2D" }}>
                  {STORE.address.street}
                </p>
                <p className="font-dm-sans font-light text-sm" style={{ color: "#1A1A1A", opacity: 0.7 }}>
                  {STORE.address.neighborhood}, {STORE.address.city}, {STORE.address.state} {STORE.address.zip}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4 mb-8">
              <div className="flex-shrink-0 pt-0.5">
                <ClockIcon />
              </div>
              <div className="flex-1">
                <p className="font-dm-sans text-xs tracking-widest uppercase mb-3" style={{ color: "#B85C38", letterSpacing: "0.18em" }}>
                  Store Hours
                </p>
                <div className="space-y-2">
                  {STORE.hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between gap-4">
                      <span className="font-dm-sans font-light text-sm" style={{ color: "#1A1A1A" }}>
                        {h.day}
                      </span>
                      <span className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "#B85C38" }}
                        />
                        <span className="font-dm-sans font-light text-sm" style={{ color: "#1A1A1A", opacity: 0.75 }}>
                          {h.open} – {h.close}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 mb-6">
              <div className="flex-shrink-0 pt-0.5">
                <PhoneIcon />
              </div>
              <div>
                <p className="font-dm-sans text-xs tracking-widest uppercase mb-1" style={{ color: "#B85C38", letterSpacing: "0.18em" }}>
                  Phone
                </p>
                <a
                  href={`tel:${STORE.phone}`}
                  className="font-cormorant text-lg font-light animated-link"
                  style={{ color: "#2C3B2D" }}
                >
                  {STORE.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 mb-10">
              <div className="flex-shrink-0 pt-0.5">
                <MailIcon />
              </div>
              <div>
                <p className="font-dm-sans text-xs tracking-widest uppercase mb-1" style={{ color: "#B85C38", letterSpacing: "0.18em" }}>
                  Email
                </p>
                <a
                  href={`mailto:${STORE.email}`}
                  className="font-cormorant text-lg font-light animated-link"
                  style={{ color: "#2C3B2D" }}
                >
                  {STORE.email}
                </a>
              </div>
            </div>

            {/* CTA */}
            <a
              href={STORE.address.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fill inline-flex items-center gap-3 font-dm-sans text-xs tracking-widest uppercase px-8 py-4 border text-charcoal transition-colors duration-300 hover:text-ivory w-fit"
              style={{ borderColor: "#2C3B2D", letterSpacing: "0.2em" }}
            >
              Get Directions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
