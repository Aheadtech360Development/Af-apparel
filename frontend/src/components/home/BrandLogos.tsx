"use client";

const BRANDS = [
  { name: "GILDAN",          color: "#E8242A" },
  { name: "BELLA+CANVAS",    color: "#1A5CFF" },
  { name: "NEXT LEVEL",      color: "#059669" },
  { name: "COMFORT COLORS",  color: "#D97706" },
  { name: "DISTRICT",        color: "#7C3AED" },
  { name: "PORT & COMPANY",  color: "#0891B2" },
];

export function BrandLogos() {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #E2E0DA", padding: "32px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "#bbb", margin: 0 }}>
            Trusted by 2,000+ businesses across the US
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>
          {BRANDS.map(brand => (
            <div
              key={brand.name}
              style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".08em", color: "#D1CEC8", transition: "color .2s", cursor: "default", userSelect: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.color = brand.color; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.color = "#D1CEC8"; }}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
