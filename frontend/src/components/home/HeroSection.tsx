"use client";

import Link from "next/link";
import Image from "next/image";
import { Flag } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const loggedIn = isAuthenticated();

  return (
    <section style={{ background: "#f4f3ef", padding: "0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 32px 44px", display: "flex", gap: "48px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1.3", minWidth: "280px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(27,58,92,.06)", border: "1px solid rgba(27,58,92,.15)", color: "#1B3A5C", fontSize: "11px", fontWeight: 700, padding: "5px 14px", borderRadius: "2px", letterSpacing: ".08em", marginBottom: "18px", textTransform: "uppercase" }}>
            <Flag size={12} style={{ flexShrink: 0 }} />
            Factory-Direct · Dallas, TX · Est. 2010
          </div>
          <h1 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "clamp(28px,4vw,46px)", color: "#1B3A5C", lineHeight: 1.05, marginBottom: "14px", fontWeight: 800 }}>
            Premium Blank Apparel.<br />
            <span style={{ color: "#1B3A5C" }}>Wholesale Pricing.</span><br />
            <span style={{ color: "#E8242A" }}>Zero Middlemen.</span>
          </h1>
          <p style={{ fontSize: "14px", color: "#5A6A7E", lineHeight: 1.7, marginBottom: "24px", maxWidth: "460px" }}>
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
              style={{ background: "none", color: "#1B3A5C", padding: "12px 24px", fontSize: "14px", borderRadius: "3px", fontWeight: 700, textDecoration: "none", border: "1.5px solid #1B3A5C" }}
            >
              Browse Products →
            </Link>
          </div>
          <div style={{ display: "flex", gap: "0", borderTop: "1px solid rgba(27,58,92,.1)", paddingTop: "20px", flexWrap: "wrap" }}>
            {[
              { n: "2,000+", l: "Wholesale Accounts" },
              { n: "50+", l: "Colors Per Style" },
              { n: "10", l: "Core SKUs" },
              { n: "Same Day", l: "Shipping by 2PM CT" },
            ].map((stat, i) => (
              <div key={stat.l} style={{ flex: 1, minWidth: "80px", padding: i === 0 ? "0 16px 0 0" : "0 16px", borderLeft: i > 0 ? "1px solid rgba(27,58,92,.1)" : "none" }}>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "26px", fontWeight: 800, color: "#1B3A5C", lineHeight: 1 }}>{stat.n}</div>
                <div style={{ fontSize: "10px", color: "rgba(27,58,92,.5)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: "3px" }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex" style={{ flex: 1, minWidth: "240px", position: "relative" }}>
          <div style={{ border: "1px solid #CBD5E1", borderRadius: "15px", height: "400px", width: "100%", overflow: "hidden", position: "relative" }}>
            <Image
              src="/Hame page Hero.png"
              alt=""
              fill
              sizes="(max-width: 1140px) 45vw, 480px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
