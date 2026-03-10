import { STORE } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Specialties", href: "#specialties" },
  { label: "Visit Us", href: "#visit" },
  { label: "Reviews", href: "#reviews" },
];

function LeafWatermark() {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-16 h-16 opacity-20"
    >
      <path d="M30 55 C30 55 10 42 10 28 C10 18 18 12 30 8 C42 12 50 18 50 28 C50 42 30 55 30 55Z" />
      <path d="M30 55 C30 55 15 36 30 20" />
      <path d="M30 20 C30 20 36 12 42 10" />
      <path d="M30 35 C22 30 18 24 20 18" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#2C3B2D" }}>
      {/* Gold divider */}
      <div className="w-full h-px" style={{ backgroundColor: "#C9A84C", opacity: 0.3 }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <span
                className="font-cormorant text-2xl font-semibold"
                style={{ color: "#C9A84C" }}
              >
                {STORE.name}
              </span>
            </div>
            <p
              className="font-playfair italic mb-6 leading-relaxed"
              style={{ color: "#F5F0E8", fontSize: "17px", opacity: 0.85 }}
            >
              &ldquo;{STORE.tagline}&rdquo;
            </p>
            <p
              className="font-dm-sans font-light text-sm"
              style={{ color: "rgba(245,240,232,0.5)" }}
            >
              Est. {STORE.established}
              <br />
              Chicago, Illinois
            </p>

            {/* Watermark */}
            <div className="mt-6" style={{ color: "#F5F0E8" }}>
              <LeafWatermark />
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <p
              className="font-dm-sans text-xs tracking-widest uppercase mb-8"
              style={{ color: "#C9A84C", letterSpacing: "0.22em" }}
            >
              Quick Links
            </p>
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="animated-link font-dm-sans font-light text-sm w-fit"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3 — Connect */}
          <div>
            <p
              className="font-dm-sans text-xs tracking-widest uppercase mb-8"
              style={{ color: "#C9A84C", letterSpacing: "0.22em" }}
            >
              Connect
            </p>
            <div className="flex flex-col gap-4">
              <a
                href={STORE.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="animated-link font-dm-sans font-light text-sm inline-flex items-center gap-2"
                style={{ color: "rgba(245,240,232,0.75)" }}
              >
                Google Maps
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
              <a
                href={`https://search.google.com/local/writereview?placeid=${STORE.googlePlaceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="animated-link font-dm-sans font-light text-sm inline-flex items-center gap-2"
                style={{ color: "rgba(245,240,232,0.75)" }}
              >
                Leave a Review
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
              {STORE.phone !== "[YOUR PHONE NUMBER]" && (
                <a
                  href={`tel:${STORE.phone}`}
                  className="animated-link font-dm-sans font-light text-sm"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  {STORE.phone}
                </a>
              )}
              {STORE.email !== "[YOUR EMAIL ADDRESS]" && (
                <a
                  href={`mailto:${STORE.email}`}
                  className="animated-link font-dm-sans font-light text-sm"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  {STORE.email}
                </a>
              )}

              {/* Today's hours callout */}
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}
              >
                <p
                  className="font-dm-sans text-xs tracking-widest uppercase mb-2"
                  style={{ color: "rgba(201,168,76,0.7)", fontSize: "9px", letterSpacing: "0.18em" }}
                >
                  Hours Today
                </p>
                <TodayHours />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-6 px-6 text-center"
        style={{ borderColor: "rgba(201,168,76,0.15)" }}
      >
        <p
          className="font-dm-sans font-light text-xs"
          style={{ color: "rgba(245,240,232,0.35)", letterSpacing: "0.1em" }}
        >
          © {year} {STORE.name}. All rights reserved. &nbsp;·&nbsp; Albany Park, Chicago, IL
        </p>
      </div>
    </footer>
  );
}

function TodayHours() {
  const today = new Date().getDay(); // 0=Sun, 6=Sat
  let hours = { open: "8:00 AM", close: "7:00 PM", label: "Mon – Fri" };

  if (today === 6) {
    hours = { open: "7:00 AM", close: "7:00 PM", label: "Saturday" };
  } else if (today === 0) {
    hours = { open: "8:00 AM", close: "5:00 PM", label: "Sunday" };
  }

  const now = new Date();
  const currentHour = now.getHours();
  const openHour = parseInt(hours.open.split(":")[0]) + (hours.open.includes("AM") ? 0 : 12);
  const closeHour = parseInt(hours.close.split(":")[0]) + (hours.close.includes("AM") ? 0 : 12);
  const isOpen = currentHour >= openHour && currentHour < closeHour;

  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: isOpen ? "#4ade80" : "#B85C38" }}
      />
      <p className="font-dm-sans font-light text-sm" style={{ color: "rgba(245,240,232,0.7)" }}>
        {isOpen ? `Open until ${hours.close}` : `Opens ${hours.open}`}
      </p>
    </div>
  );
}
