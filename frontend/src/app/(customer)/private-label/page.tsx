import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Label | AF Apparels",
  description: "Custom private label blank apparel manufacturing. Your brand, our factory expertise. Starting at 2,500 units per style/color.",
};

const steps = [
  { n: 1, title: "Request a Quote", body: "Submit your design specs, quantities, and fabric requirements. We respond within 24 hours." },
  { n: 2, title: "Design Approval", body: "Our team creates tech packs and samples. You approve colors, construction, labels, and tags." },
  { n: 3, title: "Production", body: "Your order enters our manufacturing queue. Typical lead time 60–90 days from approval." },
  { n: 4, title: "QC Inspection", body: "Full quality control inspection before shipment. AQL sampling on every production run." },
  { n: 5, title: "Delivery", body: "Bulk cartons to your warehouse or direct-to-consumer fulfillment via our 3PL partners." },
];

const options = [
  { icon: "🏷️", title: "Custom Labels", body: "Woven neck labels, hang tags, custom heat transfers — your branding, fully applied." },
  { icon: "🎨", title: "Custom Colors", body: "Pantone-matched dyeing available on most constructions. MOQ 2,500 units per color." },
  { icon: "🧵", title: "Custom Constructions", body: "Modify fabric weight, blend, thread count, and finish to hit your exact spec." },
  { icon: "📦", title: "Custom Packaging", body: "Polybag, box, or retail-ready packaging with custom inserts and branding." },
];

const specs = [
  ["Minimum Order", "2,500 units per style/color"],
  ["Lead Time", "60–90 days from approved samples"],
  ["Fabrics", "100% Cotton, CVC, Tri-Blend, Polyester, Fleece"],
  ["Weights", "4.5 oz – 12 oz available"],
  ["Styles", "T-Shirts, Hoodies, Sweatshirts, Polos, Jackets, Bottoms"],
  ["Label Options", "Woven, Printed, Tear-away, Heat transfer"],
  ["MOQ per Color", "2,500 units"],
  ["Sample Cost", "Cost of samples credited against production order"],
];

export default function PrivateLabelPage() {
  return (
    <div style={{ background: "#F4F3EF", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#111016", color: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: ".14em", color: "#1A5CFF", textTransform: "uppercase", marginBottom: "16px" }}>
            Private Label Program
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(44px, 7vw, 80px)", lineHeight: 1, letterSpacing: ".02em", marginBottom: "20px" }}>
            Your Brand.<br />Our Factory.
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,.7)", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 32px" }}>
            Launch your own apparel line with custom labels, colors, and construction. We handle manufacturing, QC, and logistics — you focus on building your brand.
          </p>
          <Link href="/contact?dept=private-label" style={{ background: "#E8242A", color: "#fff", padding: "14px 32px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "14px", textTransform: "uppercase", letterSpacing: ".06em", display: "inline-block" }}>
            Request a Quote
          </Link>
        </div>
      </div>

      {/* Who it's for */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "64px 32px 0" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "38px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "8px" }}>Who It&apos;s For</h2>
        <p style={{ fontSize: "14px", color: "#7A7880", marginBottom: "32px" }}>Private label is ideal for established brands ready to own their supply chain.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "64px" }}>
          {["Retail Brands", "E-Commerce Labels", "Corporate Merch Teams", "Influencer Brands", "Athletic Brands", "Streetwear Labels"].map(b => (
            <div key={b} style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "10px", padding: "20px 16px", textAlign: "center", fontSize: "13px", fontWeight: 700, color: "#2A2830" }}>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* 5-Step Process */}
      <div style={{ background: "#111016", padding: "64px 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "38px", letterSpacing: ".04em", color: "#fff", marginBottom: "8px", textAlign: "center" }}>The Process</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,.5)", marginBottom: "48px", textAlign: "center" }}>5 steps from idea to delivered product</p>
          <div style={{ display: "flex", gap: "0", alignItems: "stretch", flexWrap: "wrap", justifyContent: "center" }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "stretch" }}>
                <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px", padding: "28px 20px", width: "160px", textAlign: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#1A5CFF", color: "#fff", fontFamily: "var(--font-bebas)", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>{s.n}</div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>{s.title}</div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>{s.body}</p>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 6px", color: "rgba(255,255,255,.2)", fontSize: "20px" }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Options + Specs */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "34px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "24px" }}>Customization Options</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {options.map(o => (
                <div key={o.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0 }}>{o.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "#2A2830", fontSize: "14px", marginBottom: "4px" }}>{o.title}</div>
                    <p style={{ fontSize: "13px", color: "#7A7880", lineHeight: 1.5 }}>{o.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "34px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "24px" }}>Program Specs</h2>
            <div style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {specs.map(([k, v], i) => (
                    <tr key={k} style={{ borderBottom: i < specs.length - 1 ? "1px solid #F4F3EF" : "none" }}>
                      <td style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 700, color: "#7A7880", width: "42%", textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#2A2830" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#111016", color: "#fff", padding: "64px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "48px", letterSpacing: ".04em", marginBottom: "12px" }}>Start Your Private Label Journey</h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,.6)", marginBottom: "28px" }}>Send us your specs and we&apos;ll get back to you within 24 hours.</p>
        <Link href="/contact?dept=private-label" style={{ background: "#E8242A", color: "#fff", padding: "16px 36px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px", textTransform: "uppercase", letterSpacing: ".06em", display: "inline-block" }}>
          Request a Quote →
        </Link>
      </div>
    </div>
  );
}
