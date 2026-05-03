import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | AF Apparels",
  description: "America's factory-direct blank apparel supplier. Serving 2,000+ wholesale businesses from Dallas, TX since 2010.",
};

export default function AboutPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Announce */}
      <div style={{ background: "#E8242A", color: "#fff", textAlign: "center", padding: "7px 24px", fontSize: "12px", fontWeight: 600, letterSpacing: ".02em" }}>
        🇺🇸 Factory-Direct Wholesale Blanks — Serving 2,000+ American Businesses | Same-Day Shipping from Dallas, TX
      </div>

      {/* Hero */}
      <div style={{ background: "#111", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-block", background: "rgba(45,140,255,.15)", color: "#2D8CFF", fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "4px", marginBottom: "12px", letterSpacing: ".04em" }}>
                🇺🇸 Dallas, TX — Est. 2010
              </div>
              <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(24px,3.5vw,38px)", color: "#fff", margin: "12px 0 10px", lineHeight: 1.1, letterSpacing: ".04em" }}>
                America&apos;s Factory-Direct<br />Blank Apparel Supplier
              </h1>
              <p style={{ color: "#9CA3AF", fontSize: "14px", lineHeight: 1.7, maxWidth: "480px" }}>
                For over a decade, AF Apparels has been the behind-the-scenes supplier for thousands of print shops, retailers, and apparel brands across the United States. No middlemen. No compromises. Just premium blanks, direct from our factory to your door.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
                <Link href="/products" style={{ display: "inline-flex", alignItems: "center", background: "#E8242A", color: "#fff", padding: "9px 20px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "13px", letterSpacing: ".05em", borderRadius: "3px", textDecoration: "none" }}>
                  Browse Our Catalog →
                </Link>
                <Link href="/register" style={{ display: "inline-flex", alignItems: "center", background: "none", color: "#ddd", padding: "9px 20px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "13px", letterSpacing: ".05em", borderRadius: "3px", border: "2px solid #444", textDecoration: "none" }}>
                  Apply for Wholesale
                </Link>
              </div>
            </div>
            <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", height: "260px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#555", fontSize: "13px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏭</div>
              <span>[DALLAS FACILITY / TEAM PHOTO]</span>
              <span style={{ fontSize: "10px", marginTop: "4px" }}>Authentic — not stock</span>
            </div>
          </div>

          {/* Stat Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid #1f2937", marginTop: "40px", paddingTop: "32px" }}>
            {[
              { n: "14+", l: "Years in Business" },
              { n: "2,000+", l: "Active Wholesale Accounts" },
              { n: "50+", l: "Colors Available" },
              { n: "4", l: "Industry Certifications" },
            ].map(s => (
              <div key={s.l} style={{ textAlign: "center", padding: "16px" }}>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "40px", color: "#2D8CFF", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div style={{ background: "#fff", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "24px" }}>Our Story</h2>
              <p style={{ fontSize: "13.5px", color: "#555", lineHeight: 1.8, marginBottom: "14px" }}>
                American Fashion was founded in Dallas, Texas with one mission: eliminate the layers of markup between the factory and the print decorator. We watched too many small and mid-size print shops overpay for blanks through distributors, only to compress their margins and undercut their own growth.
              </p>
              <p style={{ fontSize: "13.5px", color: "#555", lineHeight: 1.8, marginBottom: "14px" }}>
                By building direct relationships with certified manufacturing partners and operating our own Dallas distribution facility, we&apos;ve been able to deliver factory-grade quality at factory-direct prices to over 2,000 businesses across every state. Our buyers range from single-person DTF studios to regional retail chains — all getting access to the same premium product, the same pricing transparency, and the same same-day service.
              </p>
              <p style={{ fontSize: "13.5px", color: "#555", lineHeight: 1.8, marginBottom: "20px" }}>
                Today, AF Apparels is one of the few remaining wholesale suppliers in the US with ISO 9000, Oeko-Tex, GOTS, and WRAP certifications — meaning every blank you receive meets rigorous quality and ethical manufacturing standards, not just the ones convenient to claim.
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                {[
                  { title: "ISO 9000", sub: "Certified" },
                  { title: "Oeko-Tex", sub: "Standard 100" },
                  { title: "GOTS", sub: "Certified" },
                  { title: "WRAP", sub: "Certified" },
                ].map(c => (
                  <div key={c.title} style={{ textAlign: "center", padding: "12px 20px", background: "#F7F8FA", border: "1px solid #eee", borderRadius: "5px" }}>
                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", fontWeight: 700, color: "#111" }}>{c.title}</div>
                    <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: ".05em" }}>{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ background: "#e8e8e8", borderRadius: "8px", height: "320px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#aaa", fontSize: "13px" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px", color: "#bbb" }}>📦</div>
                <span>[WAREHOUSE / OPERATIONS IMAGE]</span>
                <span style={{ fontSize: "10px", marginTop: "4px" }}>Dallas distribution facility</span>
              </div>
              <div style={{ marginTop: "12px", background: "#F7F8FA", border: "1px solid #eee", borderRadius: "5px", padding: "14px 16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#555", marginBottom: "8px" }}>Our Facility</div>
                <div style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.7 }}>
                  📍 Dallas, TX — 45,000 sq ft distribution center<br />
                  ⚡ Same-day shipping on orders before 2 PM CT<br />
                  📦 Deep inventory across all sizes and 50+ colors
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Stand For */}
      <div style={{ background: "#F7F8FA", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>What We Stand For</h2>
            <p style={{ fontSize: "13.5px", color: "#666", maxWidth: "560px", margin: "0 auto" }}>Four principles that shape every product, every shipment, every interaction</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px", maxWidth: "780px", margin: "0 auto" }}>
            {[
              { icon: "🏭", title: "Factory-Direct Integrity", body: "We never mark up product to cover distributor layers. What you pay reflects the actual cost of premium manufacturing — no inflated margins, no hidden fees." },
              { icon: "🎨", title: "Print-First Product Development", body: "Every fabric and construction decision is made with the decorator in mind. We test everything against DTF, screen printing, embroidery, and HTV before adding a SKU to our catalog." },
              { icon: "⚡", title: "Operational Reliability", body: "Same-day shipping, accurate stock counts, and consistent sizing aren't bonuses — they're the baseline. Your business depends on predictability, and so does ours." },
              { icon: "🌿", title: "Ethical Supply Chain", body: "WRAP, GOTS, and Oeko-Tex certifications aren't marketing badges. They represent our commitment to responsible manufacturing at every level of our supply chain." },
            ].map(v => (
              <div key={v.title} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ fontSize: "24px", flexShrink: 0 }}>{v.icon}</div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "14px", letterSpacing: ".06em", color: "#111", marginBottom: "6px" }}>{v.title}</h4>
                  <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.6 }}>{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Team */}
      <div style={{ background: "#fff", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>The Team Behind AF</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>Real people, real accountability — not a faceless wholesale portal</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
            {[
              { name: "Michael Chen", role: "Founder & CEO", bio: "14 years in wholesale apparel. Built AF from a single product line to one of the largest factory-direct operations in the South." },
              { name: "Sarah Williams", role: "Head of Wholesale Accounts", bio: "Your main point of contact for large accounts, private label inquiries, and anything that doesn't fit a standard order." },
              { name: "James Torres", role: "Operations & Fulfillment", bio: "Runs the Dallas facility. Responsible for same-day shipping accuracy and inventory reliability across all SKUs." },
            ].map(t => (
              <div key={t.name} style={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ background: "#F7F8FA", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "12px" }}>
                  [PHOTO — {t.role.toUpperCase()}]
                </div>
                <div style={{ padding: "16px" }}>
                  <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", marginBottom: "2px" }}>{t.name}</h4>
                  <div style={{ fontSize: "11px", color: "#2D8CFF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: "8px" }}>{t.role}</div>
                  <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.6 }}>{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ background: "#F7F8FA", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>Our Journey</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>From a single product line to America&apos;s factory-direct wholesale platform</p>
          </div>
          <div style={{ maxWidth: "600px" }}>
            {[
              { year: "2010", title: "Founded in Dallas, TX", body: "AF Apparels launched with 3 SKUs and a 5,000 sq ft facility, focused exclusively on ring-spun tees for the Dallas print market." },
              { year: "2013", title: "ISO 9000 & Oeko-Tex Certification", body: "Achieved first international manufacturing certifications, opening doors to corporate and retail accounts requiring compliance documentation." },
              { year: "2016", title: "Expanded to 500+ Wholesale Accounts", body: "Grew beyond Texas to serve print shops and retailers across 30+ states. Launched the online wholesale ordering platform." },
              { year: "2019", title: "Private Label Program Launched", body: "Introduced full private label manufacturing for brands wanting custom styles, neck labels, and exclusive colorways starting at 2,500 units." },
              { year: "2022", title: "45,000 Sq Ft Facility + GOTS & WRAP", body: "Moved to our current Dallas distribution center. Achieved GOTS and WRAP certifications. Expanded to 50+ colors and 10+ product categories." },
              { year: "2024", title: "2,000+ Active Wholesale Accounts", body: "Now serving print shops, retailers, apparel brands, and corporate buyers across all 50 states with same-day shipping on every in-stock order." },
            ].map((t, i) => (
              <div key={t.year} style={{ display: "flex", gap: "20px", marginBottom: i < 5 ? "28px" : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#2D8CFF", marginTop: "4px" }} />
                  {i < 5 && <div style={{ width: "2px", flex: 1, background: "#E5E7EB", marginTop: "4px" }} />}
                </div>
                <div style={{ paddingBottom: i < 5 ? "8px" : 0 }}>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", color: "#2D8CFF", letterSpacing: ".04em" }}>{t.year}</div>
                  <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "14px", letterSpacing: ".04em", color: "#111", margin: "2px 0 4px" }}>{t.title}</h4>
                  <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.6 }}>{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#080808", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4vw,42px)", color: "#fff", letterSpacing: ".04em", marginBottom: "14px" }}>
          READY TO PARTNER WITH AF?
        </h2>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: "14px", marginBottom: "28px" }}>
          Join 2,000+ businesses sourcing factory-direct from American Fashion. Apply free — approved within 24 hours.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", background: "#E8242A", color: "#fff", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", textDecoration: "none" }}>
            Apply for Wholesale Access →
          </Link>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", background: "none", color: "#ddd", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", border: "2px solid #444", textDecoration: "none" }}>
            Contact Our Team
          </Link>
        </div>
        <div style={{ color: "#374151", fontSize: "11px", marginTop: "16px" }}>
          No fees · No minimums · Approved within 24 hours · (214) 272-7213
        </div>
      </div>

    </div>
  );
}
