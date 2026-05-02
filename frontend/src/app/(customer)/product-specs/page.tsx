import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Specs | AF Apparels",
  description: "Technical product specifications for AF Apparels wholesale blank apparel catalog.",
};

export default function ProductSpecsPage() {
  return (
    <div style={{ background: "#F4F3EF", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 32px" }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>📐</div>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "48px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "12px" }}>Product Specs</h1>
        <p style={{ fontSize: "15px", color: "#7A7880", lineHeight: 1.7, marginBottom: "28px" }}>
          Detailed technical specifications for every garment in our catalog are coming soon. In the meantime, check each product page for available specs.
        </p>
        <div style={{ display: "inline-block", background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "8px", padding: "10px 20px", fontSize: "12px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".08em" }}>
          Coming Soon
        </div>
      </div>
    </div>
  );
}
