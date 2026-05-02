import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | AF Apparels",
  description: "Factory-direct wholesale blank apparel serving 2,000+ businesses across the US from our Dallas, TX warehouse.",
};

const stats = [
  { n: "2,000+", l: "Active Clients" },
  { n: "50,000+", l: "SKUs In Stock" },
  { n: "1-2 Day", l: "Dallas Shipping" },
  { n: "15+", l: "Years in Business" },
];

const values = [
  { icon: "🏭", title: "Factory-Direct", body: "We cut out the middleman entirely. Every item ships straight from our Dallas warehouse — real stock, real prices." },
  { icon: "⚡", title: "Speed First", body: "Same-day processing on orders placed before 3 PM CST. Our warehouse team treats every order like it's urgent." },
  { icon: "🤝", title: "B2B Focused", body: "Built for businesses, not drop-shippers. Volume pricing, NET 30 terms, dedicated account managers." },
  { icon: "📦", title: "No Minimums", body: "Order one unit or ten thousand. Our pricing scales automatically with volume — no MOQ games." },
];

const timeline = [
  { year: "2009", event: "Founded in Dallas, TX as a small blank apparel distributor serving local screen printers." },
  { year: "2014", event: "Expanded warehouse to 40,000 sq ft. Launched wholesale portal serving 500+ accounts." },
  { year: "2018", event: "Introduced private label program. Added premium brands to catalog. Crossed 1,000 active accounts." },
  { year: "2022", event: "Launched B2B e-commerce platform with NET 30 terms, volume pricing tiers, and real-time inventory." },
  { year: "2024", event: "2,000+ active business accounts. 50,000+ SKUs in stock. Same-day processing from Dallas." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#F4F3EF", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#111016", color: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: ".14em", color: "#E8242A", textTransform: "uppercase", marginBottom: "16px" }}>
                About AF Apparels
              </div>
              <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, letterSpacing: ".02em", marginBottom: "20px" }}>
                Wholesale Apparel,<br />Done Right.
              </h1>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,.7)", lineHeight: 1.7, marginBottom: "28px" }}>
                We&apos;re a Dallas-based wholesale blank apparel distributor serving screen printers, embroiderers, promotional product companies, and retail brands across the US.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/products" style={{ background: "#E8242A", color: "#fff", padding: "14px 28px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "14px", textTransform: "uppercase", letterSpacing: ".06em" }}>
                  Shop Catalog
                </Link>
                <Link href="/contact" style={{ background: "transparent", color: "#fff", padding: "14px 28px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "14px", border: "1.5px solid rgba(255,255,255,.25)" }}>
                  Contact Sales
                </Link>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {stats.map(s => (
                <div key={s.n} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "40px", letterSpacing: ".02em", color: "#E8242A", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,.6)", fontWeight: 600, marginTop: "6px", textTransform: "uppercase", letterSpacing: ".06em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 32px" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "40px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "8px" }}>How We Work</h2>
        <p style={{ fontSize: "14px", color: "#7A7880", marginBottom: "40px" }}>The principles that guide every order, every account, every day.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {values.map(v => (
            <div key={v.title} style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", padding: "28px" }}>
              <div style={{ fontSize: "32px", marginBottom: "14px" }}>{v.icon}</div>
              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "8px" }}>{v.title}</h3>
              <p style={{ fontSize: "13px", color: "#7A7880", lineHeight: 1.6 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story + Timeline */}
      <div style={{ background: "#fff", borderTop: "1.5px solid #E2E0DA", borderBottom: "1.5px solid #E2E0DA" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "64px", alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "40px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "20px" }}>Our Story</h2>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.75, marginBottom: "16px" }}>
                AF Apparels was founded in 2009 by a team of apparel industry veterans who were frustrated by the disconnect between manufacturers and the businesses that need blank goods fast.
              </p>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.75, marginBottom: "16px" }}>
                We built our first warehouse in Dallas because it sits at the geographic center of the US — meaning 80% of the country can receive 2-day ground shipping without expedite fees.
              </p>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.75 }}>
                Today we serve over 2,000 active wholesale accounts including screen printing shops, promotional product companies, e-commerce brands, and corporate merchandising teams.
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "24px" }}>Timeline</h3>
              <div style={{ position: "relative", paddingLeft: "28px", borderLeft: "2px solid #E2E0DA" }}>
                {timeline.map((t, i) => (
                  <div key={t.year} style={{ position: "relative", marginBottom: i < timeline.length - 1 ? "28px" : 0 }}>
                    <div style={{ position: "absolute", left: "-37px", top: "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#1A5CFF", border: "3px solid #fff", boxShadow: "0 0 0 2px #1A5CFF" }} />
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#1A5CFF", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "4px" }}>{t.year}</div>
                    <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{t.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#111016", color: "#fff", padding: "64px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "48px", letterSpacing: ".04em", marginBottom: "12px" }}>
          Ready to Open an Account?
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,.6)", marginBottom: "28px" }}>
          Apply in minutes. Get approved, then access factory-direct pricing on 50,000+ SKUs.
        </p>
        <Link href="/wholesale/register" style={{ background: "#E8242A", color: "#fff", padding: "16px 36px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px", textTransform: "uppercase", letterSpacing: ".06em", display: "inline-block" }}>
          Apply for Wholesale Access →
        </Link>
      </div>
    </div>
  );
}
