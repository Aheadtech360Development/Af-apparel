import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Print Guide | AF Apparels",
  description: "Complete decoration method guide for DTF, screen printing, sublimation, embroidery, and HTV on blank apparel.",
};

const methods = [
  {
    icon: "🖨️",
    name: "DTF (Direct-to-Film)",
    best_for: "Full-color detailed designs, photos, gradients",
    pros: ["No color limits", "Great on dark garments", "Small runs friendly", "Soft hand feel"],
    cons: ["Slightly higher cost per unit", "Not as vivid on very dark garments"],
    fabrics: { cotton: "best", polyester: "best", blend: "best", nylon: "limited" },
    tip: "DTF transfers adhere to virtually any fabric including cotton, polyester, and blends. No pretreatment needed.",
  },
  {
    icon: "🎨",
    name: "Screen Printing",
    best_for: "Large runs, spot colors, bold graphics",
    pros: ["Lowest cost per unit at scale", "Extremely durable", "Vivid PMS-matched colors"],
    cons: ["Setup cost per color", "Not ideal for photos/gradients", "Minimum runs typically 24+"],
    fabrics: { cotton: "best", polyester: "limited", blend: "best", nylon: "limited" },
    tip: "Screen printing is the industry standard for runs of 24+ pieces. Stick to 3 colors or fewer for maximum cost efficiency.",
  },
  {
    icon: "☀️",
    name: "Sublimation",
    best_for: "All-over prints, performance wear, polyester garments",
    pros: ["True all-over print", "No hand feel — dye becomes the fabric", "Photo-quality results"],
    cons: ["Polyester only (95%+ recommended)", "Poor on dark garments", "White base required"],
    fabrics: { cotton: "not-recommended", polyester: "best", blend: "limited", nylon: "best" },
    tip: "Sublimation requires 95%+ polyester content and a white or light base. Perfect for performance apparel and jerseys.",
  },
  {
    icon: "🪡",
    name: "Embroidery",
    best_for: "Logos, caps, polos, professional apparel",
    pros: ["Premium look and feel", "Extremely durable", "Professional appearance"],
    cons: ["Limited detail on small designs", "Not for large coverage areas", "Thread count limits gradients"],
    fabrics: { cotton: "best", polyester: "best", blend: "best", nylon: "limited" },
    tip: "Embroidery works on nearly all fabrics. For best results keep logos above 1 inch and avoid very thin fonts under 0.25 inches.",
  },
  {
    icon: "✂️",
    name: "HTV (Heat Transfer Vinyl)",
    best_for: "Single-color names/numbers, cut designs",
    pros: ["Low setup cost", "Great for personalization", "Durable on cotton"],
    cons: ["Manual weeding for complex designs", "Limited to fewer colors", "Not ideal for photos"],
    fabrics: { cotton: "best", polyester: "best", blend: "best", nylon: "limited" },
    tip: "HTV is ideal for sports jerseys, personalizations, and simple one-color logos. Use heat-resistant polyester HTV for athletic wear.",
  },
];

const COMPAT: Record<string, { label: string; color: string; bg: string }> = {
  best: { label: "✅ Best", color: "#059669", bg: "#d1fae5" },
  limited: { label: "⚠️ Limited", color: "#d97706", bg: "#fef3c7" },
  "not-recommended": { label: "❌ Not Recommended", color: "#dc2626", bg: "#fee2e2" },
};

export default function PrintGuidePage() {
  return (
    <div style={{ background: "#F4F3EF", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#1A5CFF", color: "#fff", padding: "64px 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(44px, 7vw, 72px)", lineHeight: 1, letterSpacing: ".02em", marginBottom: "14px" }}>
            Decoration Method Guide
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,.8)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
            Everything you need to know about DTF, screen printing, sublimation, embroidery, and HTV — and which method works best for each garment type.
          </p>
        </div>
      </div>

      {/* Methods */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {methods.map(m => (
            <div key={m.name} style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "14px", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ background: "#2A2830", color: "#fff", padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ fontSize: "28px" }}>{m.icon}</span>
                <div>
                  <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", letterSpacing: ".04em", marginBottom: "2px" }}>{m.name}</h2>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,.6)" }}>Best for: {m.best_for}</p>
                </div>
              </div>
              <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                {/* Pros/Cons */}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>Advantages</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {m.pros.map(p => <li key={p} style={{ fontSize: "13px", color: "#555", marginBottom: "5px", paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#059669" }}>✓</span>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#E8242A", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>Limitations</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {m.cons.map(c => <li key={c} style={{ fontSize: "13px", color: "#555", marginBottom: "5px", paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#E8242A" }}>✗</span>{c}</li>)}
                  </ul>
                </div>
                {/* Fabric Compat */}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>Fabric Compatibility</div>
                  {Object.entries(m.fabrics).map(([fab, compat]) => {
                    const info = COMPAT[compat];
                    return (
                      <div key={fab} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#7A7880", textTransform: "capitalize" }}>{fab}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: info.color, background: info.bg, padding: "2px 8px", borderRadius: "4px" }}>{info.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Pro Tip */}
              <div style={{ background: "#fef3c7", borderTop: "1px solid #fde68a", padding: "12px 24px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>💡</span>
                <p style={{ fontSize: "12px", color: "#92400e", lineHeight: 1.5 }}><strong>Pro tip:</strong> {m.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility Matrix */}
      <div style={{ background: "#fff", borderTop: "1.5px solid #E2E0DA", borderBottom: "1.5px solid #E2E0DA" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "64px 32px" }}>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "38px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "8px" }}>Quick Reference Matrix</h2>
          <p style={{ fontSize: "13px", color: "#7A7880", marginBottom: "28px" }}>At a glance compatibility guide for all decoration methods.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "600px" }}>
              <thead>
                <tr style={{ background: "#F4F3EF" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#7A7880", fontSize: "11px", textTransform: "uppercase", letterSpacing: ".06em", borderBottom: "1px solid #E2E0DA" }}>Method</th>
                  {["Cotton", "Polyester", "CVC Blend", "Nylon"].map(f => (
                    <th key={f} style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: "#7A7880", fontSize: "11px", textTransform: "uppercase", letterSpacing: ".06em", borderBottom: "1px solid #E2E0DA" }}>{f}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {methods.map((m, i) => (
                  <tr key={m.name} style={{ borderBottom: i < methods.length - 1 ? "1px solid #F4F3EF" : "none" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#2A2830" }}>{m.icon} {m.name}</td>
                    {[m.fabrics.cotton, m.fabrics.polyester, m.fabrics.blend, m.fabrics.nylon].map((c, j) => {
                      const info = COMPAT[c];
                      return (
                        <td key={j} style={{ padding: "12px 16px", textAlign: "center" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: info.color, background: info.bg, padding: "3px 8px", borderRadius: "4px", whiteSpace: "nowrap" }}>{info.label}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
