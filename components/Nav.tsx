"use client";

import { useEffect, useState } from "react";
import { STORE } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Specialties", href: "#specialties" },
  { label: "Visit Us", href: "#visit" },
  { label: "Reviews", href: "#reviews" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    setActiveLink(href.replace("#", ""));
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(44, 59, 45, 0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(201, 168, 76, 0.2)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 group"
            onClick={() => handleNavClick("#home")}
          >
            <LeafSVG
              className={`w-7 h-7 transition-colors duration-300 ${
                scrolled ? "text-gold" : "text-gold"
              }`}
            />
            <span
              className="font-cormorant text-2xl font-semibold tracking-wide transition-colors duration-300"
              style={{ color: scrolled ? "#C9A84C" : "#FDFAF4" }}
            >
              {STORE.name}
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = activeLink === link.href.replace("#", "");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="font-dm-sans text-sm font-light tracking-widest uppercase transition-all duration-300 relative pb-1"
                  style={{
                    color: scrolled ? "#F5F0E8" : "rgba(253, 250, 244, 0.88)",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-0 h-px bg-gold transition-all duration-300"
                    style={{ width: isActive ? "100%" : "0%" }}
                  />
                </a>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 focus-visible:outline-gold"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-7 h-px transition-all duration-300 origin-center"
              style={{
                backgroundColor: "#C9A84C",
                transform: menuOpen ? "translateY(5px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-7 h-px transition-all duration-300"
              style={{
                backgroundColor: "#C9A84C",
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
              }}
            />
            <span
              className="block w-7 h-px transition-all duration-300 origin-center"
              style={{
                backgroundColor: "#C9A84C",
                transform: menuOpen ? "translateY(-5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden"
        style={{
          backgroundColor: "rgba(44, 59, 45, 0.98)",
          backdropFilter: "blur(16px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        <nav className="flex flex-col items-center gap-10">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-cormorant text-4xl italic font-light text-ivory transition-all duration-300 hover:text-gold"
              style={{
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                opacity: menuOpen ? 1 : 0,
                transition: `all 0.4s ease ${i * 0.07}s`,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p
          className="font-dm-sans text-xs tracking-widest uppercase mt-16 transition-all duration-500"
          style={{
            color: "rgba(201,168,76,0.6)",
            opacity: menuOpen ? 1 : 0,
            transitionDelay: "0.4s",
          }}
        >
          Est. {STORE.established} · Norridge, IL
        </p>
      </div>
    </>
  );
}

function LeafSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
