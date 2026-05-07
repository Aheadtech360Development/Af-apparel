import type { Metadata } from "next";
import { Printer, Palette, Droplets, Scissors, Square, BookOpen } from "lucide-react";

const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await fetch(`${_API}/api/v1/pages-seo/print-guide`, { next: { revalidate: 300 } }).then(r => r.json());
    return {
      title: seo.meta_title ?? "Print Guide | AF Apparels",
      description: seo.meta_description ?? "Tested press settings and fabric compatibility ratings for DTF, screen printing, sublimation, embroidery, and HTV on all AF core blanks.",
      keywords: seo.keywords ?? undefined,
      openGraph: seo.og_image_url ? { images: [{ url: seo.og_image_url }] } : undefined,
    };
  } catch {
    return { title: "Print Guide | AF Apparels" };
  }
}

const METHODS = [
  {
    icon: <Printer size={22} />,
    name: "DTF Transfers",
    sub: "Direct-to-Film heat transfer",
    compat: { label: "✅ Best Method", color: "#059669", bg: "#d1fae5" },
    specs: [
      ["Temperature", "320–325°F (160–163°C)"],
      ["Time", "12–15 seconds"],
      ["Pressure", "Medium (40–60 PSI)"],
      ["Peel Type", "Cold peel (wait 10–15 sec)"],
      ["Recommended Fabrics", "Ring-Spun Cotton, CVC Blend"],
      ["Wash Durability", "50+ washes (standard settings)"],
    ],
    tipsTitle: "Pro Tips from Our Print Shop Partners",
    tips: [
      "Pre-press for 3–5 seconds to remove moisture before applying transfer",
      "Allow garment to fully cool before cold peel — rushing causes edge lift",
      "For dark garments: white underbase in the DTF print is critical",
      "Store transfers flat and away from humidity for best shelf life",
      "On CVC blends: reduce temp by 5°F vs 100% cotton",
    ],
  },
  {
    icon: <Palette size={22} />,
    name: "Screen Printing",
    sub: "Plastisol and water-based inks",
    compat: { label: "✅ Best Method", color: "#059669", bg: "#d1fae5" },
    specs: [
      ["Ink Type", "Plastisol (primary) / Water-based"],
      ["Flash Temp", "275–300°F for 3–5 sec between colors"],
      ["Cure Temp (Plastisol)", "320°F for 90 seconds minimum"],
      ["Mesh Count", "110–160 for standard / 200+ for fine detail"],
      ["Pre-Treatment", "None required on ring-spun cotton"],
      ["Wash Durability", "Excellent — 75+ washes with proper cure"],
    ],
    tipsTitle: "Pro Tips from Our Print Shop Partners",
    tips: [
      "Ring-spun cotton's smooth surface delivers sharper halftone detail vs open-end",
      "Water-based inks: test adhesion on CVC blends before production runs",
      "Tight-knit construction reduces ink bleed on fine lines",
      "No pre-press needed — fabric arrives print-ready from our facility",
    ],
  },
  {
    icon: <Droplets size={22} />,
    name: "Sublimation",
    sub: "Dye sublimation printing",
    compat: { label: "⚠️ Limited", color: "#d97706", bg: "#fef3c7" },
    warning: "⚠️ Important: Sublimation requires minimum 65% polyester content. AF core tees are cotton-heavy — sublimation is only suitable on white or very light colors, and results will be muted vs 100% polyester blanks. For sublimation runs, consider our Performance Polo (#5001) or contact us about polyester blanks.",
    specs: [
      ["Temperature", "380–400°F (193–204°C)"],
      ["Time", "45–60 seconds"],
      ["Pressure", "Medium-heavy"],
      ["Best Fabric", "#5001 Performance Polo (CVC 65/35)"],
      ["Garment Color", "White only for full vibrancy"],
      ["Recommended SKUs", "#5001 Performance Polo"],
    ],
    tipsTitle: "When Sublimation Works on AF Blanks",
    tips: [
      "White garments only — any base color will affect output",
      "Use #5001 Performance Polo for best sublimation results",
      "Expect 20–30% color reduction vs 100% polyester blank",
      "Test on a single unit before committing to a production run",
    ],
  },
  {
    icon: <Scissors size={22} />,
    name: "Embroidery",
    sub: "Machine and hand embroidery",
    compat: { label: "✅ Recommended", color: "#059669", bg: "#d1fae5" },
    specs: [
      ["Backing Type", "Cutaway (designs >10k stitches)"],
      ["Topping", "Solvy/tearaway on textured fabrics"],
      ["Needle Size", "75/11 or 80/12 for standard weight"],
      ["Thread Tension", "Standard — no adjustment typically needed"],
      ["Best Placement", "Left chest, sleeve, collar — flat areas"],
      ["Stitch Count Max", "15,000 stitches without distortion"],
    ],
    tipsTitle: "Pro Tips from Our Print Shop Partners",
    tips: [
      "Ring-spun construction creates a stable base — minimal stabilizer distortion",
      "Low-profile collar on tees sits flat under hooping for clean chest placement",
      "Avoid embroidery over seams — use flat panel areas only",
      "For fleece hoodies (#3001, #3002): use cutaway backing on all designs",
      "Pique knit on polos (#5001): use tearaway backing for cleaner finish",
    ],
  },
  {
    icon: <Square size={22} />,
    name: "HTV / Vinyl",
    sub: "Heat Transfer Vinyl",
    compat: { label: "✅ Recommended", color: "#059669", bg: "#d1fae5" },
    specs: [
      ["Temperature", "300–315°F (149–157°C)"],
      ["Time", "10–15 seconds"],
      ["Pressure", "Medium"],
      ["Peel Type", "Warm peel (most HTV brands)"],
      ["Recommended HTV", "Siser EasyWeed, ThermoFlex Plus"],
      ["Wash Durability", "40–50+ washes with correct settings"],
    ],
    tipsTitle: "Pro Tips from Our Print Shop Partners",
    tips: [
      "Pre-press 3 seconds to remove moisture and wrinkles before applying",
      "Smooth ring-spun surface = excellent adhesion vs open-end cotton",
      "For multi-layer designs: allow full cool between each layer press",
      "Avoid stretching areas (side seams) for long-term adhesion",
      "On hoodies: press flat — avoid pressing over drawstrings",
    ],
  },
  {
    icon: <BookOpen size={22} />,
    name: "After-Print Care Guide",
    sub: "Instructions for end customers",
    compat: { label: "📋 Info", color: "#555", bg: "#f0f0f0" },
    intro: "Share these care instructions with your end customers to maximize decoration durability and reduce returns.",
    specs: [
      ["Wash Temperature", "Cold water (30°C / 86°F max)"],
      ["Wash Setting", "Gentle / delicate cycle"],
      ["Tumble Dry", "Low heat or air dry preferred"],
      ["Iron", "Inside out, avoid direct iron on print"],
      ["Bleach", "Never — color fade and decoration damage"],
      ["Dry Clean", "Not recommended"],
    ],
    tipsTitle: "Suggested Customer Tag Copy",
    tips: [
      "\"Wash inside out in cold water\"",
      "\"Tumble dry low or hang dry\"",
      "\"Do not iron directly on decoration\"",
      "\"Do not bleach\"",
    ],
  },
];

const MATRIX = [
  { sku: "#1001 Premium Unisex Tee", fabric: "Ring-Spun Cotton", dtf: "★★★★★", screen: "★★★★★", sub: "★★☆☆☆", emb: "★★★★☆", htv: "★★★★★" },
  { sku: "#1000 Unisex Max Tee", fabric: "CVC 60/40", dtf: "★★★★★", screen: "★★★★☆", sub: "★★★☆☆", emb: "★★★★☆", htv: "★★★★☆" },
  { sku: "#1002 V-Neck Tee", fabric: "Ring-Spun Cotton", dtf: "★★★★★", screen: "★★★★★", sub: "★★☆☆☆", emb: "★★★☆☆", htv: "★★★★★" },
  { sku: "#3001 Pullover Hoodie", fabric: "Cotton-Poly Fleece 80/20", dtf: "★★★★☆", screen: "★★★★☆", sub: "★★★☆☆", emb: "★★★★★", htv: "★★★★☆" },
  { sku: "#4001 Crewneck Sweatshirt", fabric: "Cotton-Poly Fleece 70/30", dtf: "★★★★☆", screen: "★★★★☆", sub: "★★★☆☆", emb: "★★★★★", htv: "★★★☆☆" },
  { sku: "#5001 Performance Polo", fabric: "CVC 65/35", dtf: "★★★★☆", screen: "★★★★☆", sub: "★★★★☆", emb: "★★★★★", htv: "★★★☆☆" },
  { sku: "#6001 Women's Crop Tee", fabric: "Ring-Spun Cotton", dtf: "★★★★★", screen: "★★★★★", sub: "★★☆☆☆", emb: "★★★☆☆", htv: "★★★★★" },
];

export default function PrintGuidePage() {
  return (
    <div style={{ background: "#F7F8FA", minHeight: "100vh" }}>

      {/* Announce */}
      <div style={{ background: "#E8242A", color: "#fff", textAlign: "center", padding: "7px 24px", fontSize: "12px", fontWeight: 600, letterSpacing: ".02em" }}>
        🖨️ Print Guide — Tested Press Settings &amp; Compatibility for AF Blanks
      </div>

      {/* Hero */}
      <div style={{ background: "#0a1628", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(45,140,255,.15)", color: "#2D8CFF", fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "4px", marginBottom: "12px", letterSpacing: ".04em" }}>
            🔬 Tested in our Dallas facility + validated by 200+ print shops
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(22px,3vw,36px)", color: "#fff", margin: "12px 0 10px", letterSpacing: ".04em" }}>
            Printing Recommendations
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "14px", lineHeight: 1.7, maxWidth: "560px", marginBottom: "24px" }}>
            Every AF blank has been tested against major decoration methods. These are real press settings and compatibility ratings — not manufacturer guesswork. Use them as your baseline and adjust for your specific setup.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["DTF Transfers", "Screen Printing", "Sublimation", "Embroidery", "HTV / Vinyl"].map((tab, i) => (
              <div key={tab} style={{ padding: "7px 14px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, background: i === 0 ? "#E8242A" : "rgba(255,255,255,.08)", color: i === 0 ? "#fff" : "#9CA3AF", cursor: "default" }}>
                {tab}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Method Cards */}
      <div style={{ background: "#F7F8FA", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>Decoration Method Guide</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>Press settings and compatibility ratings for all AF core blanks</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "20px" }}>
            {METHODS.map(m => (
              <div key={m.name} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ background: "#0a1628", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#9CA3AF", flexShrink: 0 }}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".04em", color: "#fff", marginBottom: "2px" }}>{m.name}</h3>
                    <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{m.sub}</p>
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: m.compat.color, background: m.compat.bg, padding: "3px 8px", borderRadius: "4px", whiteSpace: "nowrap" }}>{m.compat.label}</div>
                </div>

                {/* Body */}
                <div style={{ padding: "16px 20px" }}>
                  {"warning" in m && m.warning && (
                    <div style={{ background: "#fef3c7", borderLeft: "3px solid #d97706", padding: "10px 14px", borderRadius: "0 4px 4px 0", fontSize: "12.5px", color: "#374151", marginBottom: "14px" }}>
                      {m.warning}
                    </div>
                  )}
                  {"intro" in m && m.intro && (
                    <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.6, marginBottom: "14px" }}>{m.intro}</p>
                  )}
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", marginBottom: "16px" }}>
                    <tbody>
                      {m.specs.map(([k, v]) => (
                        <tr key={k} style={{ borderBottom: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "7px 0", color: "#6B7280", width: "45%", fontWeight: 600 }}>{k}</td>
                          <td style={{ padding: "7px 0", color: "#111" }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "8px" }}>{m.tipsTitle}</div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {m.tips.map(tip => (
                        <li key={tip} style={{ fontSize: "12px", color: "#555", padding: "3px 0 3px 14px", position: "relative", lineHeight: 1.5 }}>
                          <span style={{ position: "absolute", left: 0, color: "#2D8CFF", fontWeight: 700 }}>›</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fabric Compatibility Matrix */}
      <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>Fabric Compatibility Matrix</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>At-a-glance compatibility ratings for all AF core blanks by decoration method</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "680px" }}>
              <thead>
                <tr style={{ background: "#F7F8FA" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: ".06em", borderBottom: "1px solid #E5E7EB", minWidth: "180px" }}>AF Blank / SKU</th>
                  {["DTF", "Screen Print", "Sublimation", "Embroidery", "HTV"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: ".06em", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, i) => (
                  <tr key={row.sku} style={{ borderBottom: i < MATRIX.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#111", fontSize: "13px" }}>
                      {row.sku}<br />
                      <span style={{ fontSize: "11px", color: "#aaa", fontWeight: 400 }}>{row.fabric}</span>
                    </td>
                    {[row.dtf, row.screen, row.sub, row.emb, row.htv].map((stars, j) => (
                      <td key={j} style={{ padding: "12px 16px", textAlign: "center", fontSize: "11px", color: stars.startsWith("★★☆") ? "#dc2626" : stars.startsWith("★★★★★") ? "#059669" : "#d97706" }}>
                        {stars}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "14px", flexWrap: "wrap", fontSize: "12px", color: "#555" }}>
            <span style={{ color: "#059669" }}>★★★★★ Best — highly recommended</span>
            <span style={{ color: "#d97706" }}>★★★★☆ Good — works well</span>
            <span style={{ color: "#d97706" }}>★★★☆☆ Limited — test first</span>
            <span style={{ color: "#dc2626" }}>★★☆☆☆ Not recommended</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#f4f3ef", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4vw,42px)", color: "#0a1628", letterSpacing: ".04em", marginBottom: "14px" }}>
          QUESTIONS ABOUT YOUR SETUP?
        </h2>
        <p style={{ color: "#444", fontSize: "14px", marginBottom: "28px" }}>
          Our team has worked with 2,000+ print shops. Contact us with your specific decoration method and garment — we&apos;ll give you exact settings.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/contact" style={{ display: "inline-flex", alignItems: "center", background: "#E8242A", color: "#fff", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", textDecoration: "none" }}>
            Contact Our Print Team →
          </a>
          <a href="/products" style={{ display: "inline-flex", alignItems: "center", background: "none", color: "#0a1628", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", border: "2px solid #0a1628", textDecoration: "none" }}>
            Browse All Blanks
          </a>
        </div>
        <div style={{ color: "#555", fontSize: "11px", marginTop: "16px" }}>
          📞 (214) 272-7213 · info.afapparel@gmail.com
        </div>
      </div>

    </div>
  );
}
