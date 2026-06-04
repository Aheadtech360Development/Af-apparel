"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth.store";

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const loggedIn = isAuthenticated();

  return (
    <section style={{ background: "#FFFFFF", padding: "72px 24px" }}>
      <div style={{ maxWidth: "1500px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="hero-inner-grid">
        {/* Left — text */}
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "52px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1.1, marginBottom: "18px", letterSpacing: "-0.01em" }}>
            Premium Blank Apparel. Wholesale Prices. Ships Same Day.
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "17px", color: "#6B6B6B", lineHeight: 1.65, marginBottom: "32px" }}>
            No minimums. No markups. Delivered fast from Dallas, TX.
          </p>
          <div className="hero-cta-row" style={{ display: "flex", gap: "12px", marginBottom: "0px", flexWrap: "wrap" }}>
            <Link
              href="/products"
              style={{ background: "#1C3557", color: "#fff", padding: "12px 24px", fontSize: "14px", fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", letterSpacing: ".01em", display: "inline-block" }}
            >
              Shop All →
            </Link>
            <Link
              href={loggedIn ? "/account" : "/wholesale/register"}
              style={{ background: "transparent", color: "#1C3557", padding: "12px 24px", fontSize: "14px", fontWeight: 500, textDecoration: "none", border: "1px solid #1C3557", fontFamily: "'DM Sans', sans-serif", display: "inline-block" }}
            >
              Apply for Wholesale Account
            </Link>
          </div>
        </div>

        {/* Right — image */}
        <div className="hero-img-col" style={{ display: "flex" }}>
          <div style={{ border: "1px solid #E2E2DE", height: "480px", width: "100%", overflow: "hidden", position: "relative" }}>
            <Image
              src="/Hame page Hero.png"
              alt="Premium blank apparel"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
