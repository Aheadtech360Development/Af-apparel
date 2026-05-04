"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Ruler } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface ProductSpec {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string | null;
  sort_order: number;
}

export default function ProductSpecsPage() {
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<ProductSpec[]>("/api/v1/product-specs")
      .then(res => setSpecs((res as any).data ?? res ?? []))
      .catch(() => setSpecs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#F4F3EF", minHeight: "100vh" }}>
      {/* Announce */}
      <div style={{ background: "#2A2830", color: "#fff", textAlign: "center", padding: "10px 20px", fontSize: "12px", fontWeight: 600, letterSpacing: ".05em" }}>
        <Ruler size={13} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
        Technical Product Specifications — Measurements, Fabric Data & Construction Details
      </div>

      {/* Hero */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E0DA", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#F4F3EF", border: "1px solid #E2E0DA", borderRadius: "100px", padding: "6px 16px", fontSize: "12px", fontWeight: 700, color: "#7A7880", letterSpacing: ".06em", marginBottom: "20px" }}>
          <FileText size={13} />
          FACTORY-DIRECT SPEC DATA
        </div>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,6vw,64px)", letterSpacing: ".04em", color: "#2A2830", lineHeight: 1, marginBottom: "16px" }}>
          Product Specs
        </h1>
        <p style={{ fontSize: "16px", color: "#7A7880", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
          Detailed technical specifications for every garment in our catalog — including measurements, fabric content, construction details, and compliance data.
        </p>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 32px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "12px", border: "1.5px solid #E2E0DA", height: "140px", opacity: 0.5 }} />
            ))}
          </div>
        ) : specs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 32px" }}>
            <Ruler size={48} style={{ color: "#E2E0DA", marginBottom: "16px" }} />
            <p style={{ fontSize: "15px", color: "#7A7880" }}>Product spec sheets will be available here soon.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {specs.map(spec => (
              <SpecCard key={spec.id} spec={spec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SpecCard({ spec }: { spec: ProductSpec }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: `1.5px solid ${hovered ? "#1A5CFF" : "#E2E0DA"}`,
        padding: "24px",
        transition: "border-color .15s, box-shadow .15s",
        boxShadow: hovered ? "0 4px 20px rgba(26,92,255,.1)" : "0 1px 4px rgba(0,0,0,.04)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", background: "#F4F3EF", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FileText size={20} style={{ color: "#7A7880" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#2A2830", marginBottom: "4px", lineHeight: 1.3 }}>{spec.title}</div>
          {spec.description && (
            <div style={{ fontSize: "12px", color: "#7A7880", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
              {spec.description}
            </div>
          )}
        </div>
      </div>

      {spec.pdf_url ? (
        <a
          href={spec.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            background: hovered ? "#1A5CFF" : "#2A2830", color: "#fff",
            border: "none", borderRadius: "8px", padding: "10px 16px",
            fontSize: "12px", fontWeight: 700, textDecoration: "none",
            transition: "background .15s", letterSpacing: ".04em",
          }}
        >
          <Download size={14} />
          View Specs
        </a>
      ) : (
        <div style={{ background: "#F4F3EF", borderRadius: "8px", padding: "10px 16px", fontSize: "12px", fontWeight: 600, color: "#aaa", textAlign: "center" }}>
          Coming Soon
        </div>
      )}
    </div>
  );
}
