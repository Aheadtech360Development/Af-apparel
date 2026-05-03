import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Label | AF Apparels",
  description: "Custom private label blank apparel manufacturing. Your brand, our factory expertise. Starting at 2,500 units per style/color.",
};

export default function PrivateLabelPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Announce */}
      <div style={{ background: "#E8242A", color: "#fff", textAlign: "center", padding: "7px 24px", fontSize: "12px", fontWeight: 600, letterSpacing: ".02em" }}>
        🏷️ Private Label Program — Custom Styles, Your Brand, Factory-Direct | Min. 2,500 Units/Style/Color
      </div>

      {/* Hero */}
      <div style={{ background: "#111", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-block", background: "rgba(45,140,255,.15)", color: "#2D8CFF", fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "4px", marginBottom: "12px", letterSpacing: ".04em" }}>
                🏷️ Private Label Program
              </div>
              <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(22px,3vw,36px)", color: "#fff", margin: "12px 0 10px", lineHeight: 1.1, letterSpacing: ".04em" }}>
                Build Your Brand on<br />Factory-Direct Blanks
              </h1>
              <p style={{ color: "#9CA3AF", fontSize: "14px", lineHeight: 1.7, maxWidth: "460px" }}>
                Custom neck labels, exclusive colorways, unique styles — all manufactured to your spec and delivered direct from our Dallas facility. Your brand, our infrastructure, no middlemen.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "22px", flexWrap: "wrap" }}>
                <a href="/contact?dept=private-label" style={{ display: "inline-flex", alignItems: "center", background: "#E8242A", color: "#fff", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", textDecoration: "none" }}>
                  Request a Quote →
                </a>
                <a href="#" style={{ display: "inline-flex", alignItems: "center", background: "none", color: "#ddd", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", border: "2px solid #444", textDecoration: "none" }}>
                  Download Program Guide
                </a>
              </div>
              <div style={{ display: "flex", gap: "24px", marginTop: "22px", flexWrap: "wrap" }}>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>📦 <span style={{ color: "#9CA3AF", fontWeight: 600 }}>Min. 2,500 units</span> per style/color</div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>📅 <span style={{ color: "#9CA3AF", fontWeight: 600 }}>45–60 day</span> lead time</div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>🌍 <span style={{ color: "#9CA3AF", fontWeight: 600 }}>WRAP & GOTS</span> certified</div>
              </div>
            </div>
            <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", height: "280px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#555", fontSize: "13px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>👕</div>
              <span>[PRIVATE LABEL PRODUCT PHOTO]</span>
              <span style={{ fontSize: "10px", marginTop: "4px" }}>Custom neck label / branded hang tag</span>
            </div>
          </div>
        </div>
      </div>

      {/* Who Private Label Is For */}
      <div style={{ background: "#fff", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>Who Private Label Is For</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>Not every business is ready for private label — here&apos;s who gets the most value</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
            {[
              { icon: "👗", title: "Apparel Brands", body: "Building a clothing line and need consistent, branded blanks with your own label at scale." },
              { icon: "🏪", title: "Retailers", body: "Retailers wanting exclusive styles or house-brand basics that differentiate from standard wholesale." },
              { icon: "🖨️", title: "Print Shops", body: "High-volume decorators wanting to offer clients a fully branded blank rather than a standard SKU." },
            ].map(w => (
              <div key={w.title} style={{ background: "#F7F8FA", border: "1px solid #eee", borderRadius: "6px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{w.icon}</div>
                <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".06em", color: "#111", marginBottom: "6px" }}>{w.title}</h4>
                <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.6 }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: "#F7F8FA", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>How It Works</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>From inquiry to your branded product on shelf — a clear, 5-step process</p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "stretch", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { n: 1, title: "Submit Inquiry", body: "Tell us about your brand, volume targets, and customization needs via our quote form." },
              { n: 2, title: "Design & Sampling", body: "Our team creates samples based on your spec. You review and approve before production begins." },
              { n: 3, title: "Production", body: "Your order enters production at our certified facility. 45–60 day lead time from approval." },
              { n: 4, title: "QA & Inspection", body: "Every unit passes our quality assurance checklist before leaving the facility." },
              { n: 5, title: "Ship to You", body: "Delivered to your door or facility, packaged and labeled to your spec." },
            ].map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "24px 16px", width: "170px", textAlign: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#2D8CFF", color: "#fff", fontFamily: "var(--font-bebas)", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{s.n}</div>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".06em", color: "#111", marginBottom: "6px" }}>{s.title}</div>
                  <p style={{ fontSize: "11px", color: "#555", lineHeight: 1.5 }}>{s.body}</p>
                </div>
                {i < 4 && <div style={{ color: "#D1D5DB", fontSize: "20px", padding: "0 4px" }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div style={{ background: "#fff", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>Customization Options</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>Everything you need to make the product fully yours</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {[
              {
                tag: "Branding", title: "Labels & Tags",
                body: "Full custom neck labels (woven or printed), hang tags, bag inserts, and care label replacement. Your brand identity on every unit.",
                items: ["Woven neck labels", "Printed neck labels", "Custom hang tags", "Polybag with logo", "Custom care labels"],
              },
              {
                tag: "Product", title: "Custom Styles & Cuts",
                body: "Modify existing AF silhouettes or develop entirely new cuts. Drop shoulder, oversized, cropped, extended — your design specifications.",
                items: ["Modified silhouettes", "Custom fits and cuts", "Unique necklines", "Length modifications", "New style development"],
              },
              {
                tag: "Fabric & Color", title: "Exclusive Colorways",
                body: "Access custom Pantone color matches not available in our standard catalog. Reserve colorways exclusively for your brand.",
                items: ["Pantone color matching", "Exclusive color reservations", "Custom fabric blends", "Specialty finishes", "Fabric weight customization"],
              },
            ].map(o => (
              <div key={o.title} style={{ border: "1px solid #E5E7EB", borderRadius: "6px", padding: "20px" }}>
                <div style={{ display: "inline-block", background: "#dde8ff", color: "#2D8CFF", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: ".05em" }}>{o.tag}</div>
                <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>{o.title}</h4>
                <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.6, marginBottom: "12px" }}>{o.body}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {o.items.map(it => (
                    <li key={it} style={{ fontSize: "12px", color: "#555", padding: "3px 0 3px 14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#059669" }}>✓</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Specifications */}
      <div style={{ background: "#F7F8FA", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>Program Specifications</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>Everything you need to know before starting your private label inquiry</p>
          </div>
          <div style={{ maxWidth: "680px", margin: "0 auto", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden" }}>
            {[
              ["Minimum Order Quantity", "2,500 units per style per color"],
              ["Standard Lead Time", "45–60 days from approval"],
              ["Sampling Lead Time", "10–14 business days"],
              ["Sample Cost", "$75–$150 per sample (credited on order)"],
              ["Certifications", "WRAP, GOTS, ISO 9000, Oeko-Tex"],
              ["Color Matching", "Pantone TPG/TPX system"],
              ["Shipping", "DDP (Delivered Duty Paid) to US destinations"],
              ["Payment Terms", "50% deposit, 50% on shipment"],
              ["Accepted Payments", "Wire transfer, ACH, NET 30 (qualified accounts)"],
              ["Quality Assurance", "100% inspection before shipment"],
            ].map(([label, val], i) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: i < 9 ? "1px solid #F7F8FA" : "none" }}>
                <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</span>
                <span style={{ fontSize: "13px", color: "#111", fontWeight: 600, textAlign: "right" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#080808", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(24px,3.5vw,36px)", color: "#fff", letterSpacing: ".04em", marginBottom: "14px" }}>
          READY TO BUILD YOUR BRAND?
        </h2>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: "14px", marginBottom: "24px" }}>
          Tell us about your project and our private label team will respond within 1 business day with pricing, timeline, and next steps.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "14px" }}>
          <a href="/contact?dept=private-label" style={{ display: "inline-flex", alignItems: "center", background: "#E8242A", color: "#fff", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", textDecoration: "none" }}>
            Request a Private Label Quote →
          </a>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", background: "none", color: "#ddd", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", border: "2px solid #444", textDecoration: "none" }}>
            Download Program Guide
          </a>
        </div>
        <div style={{ fontSize: "11px", color: "#374151" }}>
          📞 (214) 272-7213 &nbsp;·&nbsp; privatelabel@afapparel.com &nbsp;·&nbsp; Response within 1 business day
        </div>
      </div>

    </div>
  );
}
