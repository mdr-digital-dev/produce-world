export default function Marquee() {
  const items = [
    "FRESH DAILY",
    "MEDITERRANEAN IMPORTS",
    "GREEK & BALKAN SPECIALTIES",
    "CHICAGO'S NEIGHBORHOOD MARKET",
    "SINCE 1994",
    "ALBANY PARK",
    "FAMILY OWNED",
    "FRESH DAILY",
    "MEDITERRANEAN IMPORTS",
    "GREEK & BALKAN SPECIALTIES",
    "CHICAGO'S NEIGHBORHOOD MARKET",
    "SINCE 1994",
    "ALBANY PARK",
    "FAMILY OWNED",
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#2C3B2D",
        borderTop: "2px solid #B85C38",
        borderBottom: "2px solid #B85C38",
      }}
    >
      <div className="marquee-track py-4">
        {items.map((item, i) => (
          <span
            key={i}
            className="font-dm-sans text-xs font-light tracking-widest uppercase whitespace-nowrap"
            style={{ color: "#C9A84C" }}
          >
            {item}
            <span className="mx-6" style={{ color: "#B85C38" }}>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
