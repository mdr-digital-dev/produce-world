"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { REVIEWS, STORE } from "@/lib/constants";

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C9A84C">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="relative py-16 lg:py-36 overflow-hidden"
      style={{ backgroundColor: "#2C3B2D" }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #C9A84C 1px, transparent 1px), radial-gradient(circle at 80% 20%, #C9A84C 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
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
              Community Love
            </span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#B85C38" }} />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-cormorant font-light italic leading-tight mb-6"
            style={{ fontSize: "clamp(34px, 5vw, 56px)", color: "#FDFAF4" }}
          >
            What Our Community Says
          </motion.h2>

          {/* Rating */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-3"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A84C">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>
            <span className="font-cormorant text-xl font-light" style={{ color: "#C9A84C" }}>
              {STORE.googleRating} on Google
            </span>
            <span className="font-dm-sans text-xs" style={{ color: "rgba(245,240,232,0.5)" }}>
              · {STORE.googleReviewCount}+ Reviews
            </span>
          </motion.div>
        </motion.div>

        {/* Review Cards — horizontal scroll */}
        <div
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="snap-start flex-shrink-0 p-6 lg:p-8"
              style={{
                width: "clamp(260px, 80vw, 380px)",
                backgroundColor: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(201,168,76,0.3)",
              }}
            >
              <StarRow count={review.stars} />
              <blockquote
                className="font-playfair italic mb-6 leading-relaxed"
                style={{ color: "#F5F0E8", fontSize: "16px", lineHeight: "1.8" }}
              >
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-px"
                  style={{ backgroundColor: "#C9A84C", opacity: 0.5 }}
                />
                <div>
                  <p
                    className="font-dm-sans tracking-widest uppercase"
                    style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.16em" }}
                  >
                    {review.reviewer}
                  </p>
                  <p
                    className="font-dm-sans font-light"
                    style={{ color: "rgba(245,240,232,0.5)", fontSize: "11px" }}
                  >
                    {review.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Badge */}
        {/* TODO: Replace with Google Places API live rating using STORE.googlePlaceId */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <div
            className="flex items-center gap-4 px-6 py-4"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            {/* Google G logo */}
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <div>
              <p className="font-dm-sans text-xs tracking-widest uppercase" style={{ color: "#C9A84C", letterSpacing: "0.16em" }}>
                Google Rating
              </p>
              <p className="font-cormorant text-2xl font-light" style={{ color: "#FDFAF4" }}>
                {STORE.googleRating} ★ · {STORE.googleReviewCount}+ Reviews
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
