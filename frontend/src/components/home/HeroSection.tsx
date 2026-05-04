"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const loggedIn = isAuthenticated();

  return (
    <section style={{ background: "#1B3A5C", padding: "0" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "48px 24px 44px", display: "flex", gap: "48px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1.3", minWidth: "280px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.7)", fontSize: "11px", fontWeight: 700, padding: "5px 14px", borderRadius: "2px", letterSpacing: ".08em", marginBottom: "18px", textTransform: "uppercase" }}>
            🇺🇸 Factory-Direct · Dallas, TX · Est. 2010
          </div>
          <h1 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "clamp(28px,4vw,46px)", color: "#fff", lineHeight: 1.05, marginBottom: "14px", fontWeight: 800 }}>
            Premium Blank Apparel.<br />
            <span style={{ color: "#1E90FF" }}>Wholesale Pricing.</span><br />
            <span style={{ color: "#E8242A" }}>Zero Middlemen.</span>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,.6)", lineHeight: 1.7, marginBottom: "24px", maxWidth: "460px" }}>
            AF Apparels supplies 2,000+ print shops, brands, and corporate buyers nationwide with print-optimized blanks straight from our Dallas warehouse. ISO 9000 certified. Same-day shipping. No MOQ on in-stock styles.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px" }}>
            <Link
              href={loggedIn ? "/account" : "/wholesale/register"}
              style={{ background: "#E8242A", color: "#fff", padding: "13px 30px", fontSize: "16px", borderRadius: "3px", fontWeight: 700, textDecoration: "none", fontFamily: "'Barlow Semi Condensed', sans-serif", letterSpacing: ".04em" }}
            >
              {loggedIn ? "Go to Dashboard" : "Apply for Wholesale Account"}
            </Link>
            <Link
              href="/products"
              style={{ background: "none", color: "rgba(255,255,255,.8)", padding: "12px 24px", fontSize: "14px", borderRadius: "3px", fontWeight: 700, textDecoration: "none", border: "1.5px solid rgba(255,255,255,.3)" }}
            >
              Browse Products →
            </Link>
          </div>
          <div style={{ display: "flex", gap: "0", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "20px", flexWrap: "wrap" }}>
            {[
              { n: "2,000+", l: "Wholesale Accounts" },
              { n: "50+", l: "Colors Per Style" },
              { n: "10", l: "Core SKUs" },
              { n: "Same Day", l: "Shipping by 2PM CT" },
            ].map((stat, i) => (
              <div key={stat.l} style={{ flex: 1, minWidth: "80px", padding: i === 0 ? "0 16px 0 0" : "0 16px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,.1)" : "none" }}>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "26px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{stat.n}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: "3px" }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex" style={{ flex: 1, minWidth: "240px", position: "relative" }}>
          <div style={{ background: "#1E293B", border: "1px dashed #334155", borderRadius: "4px", height: "300px", width: "100%", overflow: "hidden", position: "relative" }}>
            <img
              src="/image1.webp"
              alt="AF Apparels Wholesale Blanks"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
