import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Leaf, Handshake, FileText } from "lucide-react";

const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await fetch(`${_API}/api/v1/pages-seo/about`, { next: { revalidate: 300 } }).then(r => r.json());
    return {
      title: seo.meta_title ?? "About Us | AF Apparels",
      description: seo.meta_description ?? "Factory-direct wholesale blank apparel. Dallas, TX. Serving the US print industry since 2010.",
      keywords: seo.keywords ?? undefined,
      openGraph: seo.og_image_url ? { images: [{ url: seo.og_image_url }] } : undefined,
    };
  } catch {
    return { title: "About Us | AF Apparels" };
  }
}

export default function AboutPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Page Hero */}
      <div style={{ background: "#1B3A5C", padding: "36px 0", borderBottom: "3px solid #E8242A" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>About AF Apparels</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,.55)", maxWidth: "500px" }}>Factory-direct wholesale blank apparel. Dallas, TX. Serving the US print industry since 2010.</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "#fff", padding: "40px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <div className="about-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "40px" }}>
            {[
              { n: "2,000+", l: "Wholesale Accounts" },
              { n: "15 yrs", l: "Industry Experience" },
              { n: "Dallas, TX", l: "Warehouse & HQ" },
              { n: "Same Day", l: "Fulfillment by 2PM CT" },
            ].map(s => (
              <div key={s.l} style={{ background: "#F4F6F9", border: "1px solid #E2E8F0", borderRadius: "4px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "32px", fontWeight: 800, color: "#1B3A5C", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", textTransform: "uppercase", letterSpacing: ".05em" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Our Story */}
          <div style={{ display: "flex", gap: "48px", alignItems: "flex-start", flexWrap: "wrap", paddingBottom: "40px" }}>
            <div style={{ flex: "1.2", minWidth: "260px" }}>
              <div style={{ marginBottom: "36px" }}>
                <h2 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>Our Story</h2>
              </div>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.8, marginBottom: "16px" }}>
                American Fashion was founded with a single purpose: remove the middlemen that drive up blank apparel costs for the US print industry. For too long, screen printers, DTF shops, and apparel brands were paying distributor markups of 20–35% on every blank they ordered.
              </p>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.8, marginBottom: "24px" }}>
                We established direct factory relationships and a purpose-built Dallas fulfillment center to change that. Today, 2,000+ print businesses across the US stock with AF — paying factory-direct prices and receiving same-day fulfillment from our centrally-located warehouse.
              </p>

              {/* Timeline */}
              <div style={{ position: "relative", paddingLeft: "24px", borderLeft: "2px solid #E2E8F0" }}>
                {[
                  { year: "2010", title: "Founded in Dallas", body: "First warehouse opened. Initial focus on ring-spun cotton tees for the Texas print market." },
                  { year: "2015", title: "ISO 9000 Certification", body: "Full quality management system certified. GOTS and Oeko-Tex certifications followed." },
                  { year: "2019", title: "500+ Active Accounts", body: "Expanded to full apparel line: hoodies, sweatshirts, polos. National shipping program launched." },
                  { year: "2023", title: "Private Label Program", body: "Launched turnkey private label manufacturing for apparel brands. Min 2,500 pcs/style/color." },
                  { year: "2025", title: "2,000+ Accounts Nationwide", body: "Serving screen printers, DTF shops, brands, and corporate buyers across all 50 states." },
                ].map((item, i) => (
                  <div key={item.year} style={{ marginBottom: i < 4 ? "24px" : 0, position: "relative" }}>
                    <div style={{ position: "absolute", left: "-31px", top: "3px", width: "14px", height: "14px", background: "#E8242A", border: "3px solid #fff", borderRadius: "50%", boxShadow: "0 0 0 2px #E8242A" }} />
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#1E90FF", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "3px" }}>{item.year}</div>
                    <h4 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "15px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>{item.title}</h4>
                    <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.6 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: "15px", height: "300px", overflow: "hidden", position: "relative", marginBottom: "12px" }}>
                <Image
                  src="/Our Store.png"
                  alt="AF Apparels Dallas Warehouse Facility"
                  fill
                  sizes="(max-width: 1140px) 35vw, 380px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: "15px", height: "380px", overflow: "hidden", position: "relative" }}>
                <Image
                  src="/Our Story-2.png"
                  alt="AF Apparels Interior Fulfillment Rack System"
                  fill
                  sizes="(max-width: 1140px) 35vw, 380px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div style={{ background: "#F4F6F9", padding: "36px 0" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>Certifications &amp; Compliance</h2>
            <p style={{ fontSize: "14px", color: "#64748B", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>Every AF product meets international production, environmental, and ethical standards.</p>
          </div>
          <div className="about-cert-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {[
              { icon: <Trophy size={28} style={{ color: "#1B3A5C" }} />, title: "ISO 9000", body: "Full quality management system. Consistent production standards, run-to-run." },
              { icon: <Leaf size={28} style={{ color: "#1B3A5C" }} />, title: "Oeko-Tex Standard 100", body: "Every component tested for harmful substances. Safe for sensitive skin." },
              { icon: <Leaf size={28} style={{ color: "#1B3A5C" }} />, title: "GOTS Certified", body: "Global Organic Textile Standard. Organic cotton sourced and verified from field to finished product." },
              { icon: <Handshake size={28} style={{ color: "#1B3A5C" }} />, title: "WRAP Certified", body: "Worldwide Responsible Accredited Production. Ethical labor, legal compliance, safe working conditions." },
            ].map(c => (
              <div key={c.title} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "4px", padding: "20px 14px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>{c.icon}</div>
                <h5 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: ".03em", marginBottom: "4px", color: "#1B3A5C" }}>{c.title}</h5>
                <p style={{ fontSize: "11px", color: "#64748B", lineHeight: 1.5 }}>{c.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "32px" }}>
            <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%)", borderRadius: "12px", padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px", flexShrink: 0 }}>
                <FileText size={24} color="white" />
              </div>
              <div>
                <p style={{ color: "white", fontWeight: "700", fontSize: "15px", margin: "0 0 6px" }}>
                  Corporate &amp; Institutional Buyers
                </p>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                  Full certification documentation available on request. Contact us at{" "}
                  <a href="mailto:info@afblanks.com" style={{ color: "#D01F2D", textDecoration: "none" }}>
                    info@afblanks.com
                  </a>
                  {" "}or{" "}
                  <a href="tel:+14693679753" style={{ color: "#D01F2D", textDecoration: "none" }}>
                    +1 (469) 367-9753
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
