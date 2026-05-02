import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style Sheets | AF Apparels",
  description: "Downloadable style sheets and spec sheets for AF Apparels wholesale catalog.",
};

export default function StyleSheetsPage() {
  return (
    <div style={{ background: "#F4F3EF", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 32px" }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>📄</div>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "48px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "12px" }}>Style Sheets</h1>
        <p style={{ fontSize: "15px", color: "#7A7880", lineHeight: 1.7, marginBottom: "28px" }}>
          Downloadable style sheets and spec sheets for our wholesale catalog are coming soon. Check back shortly.
        </p>
        <div style={{ display: "inline-block", background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "8px", padding: "10px 20px", fontSize: "12px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".08em" }}>
          Coming Soon
        </div>
      </div>
    </div>
  );
}
