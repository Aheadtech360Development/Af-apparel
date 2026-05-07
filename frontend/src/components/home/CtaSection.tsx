"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";

export default function CtaSection() {
  const { isAuthenticated } = useAuthStore();
  const loggedIn = isAuthenticated();

  return (
    <div style={{ background: "#f4f3ef", padding: "52px 0", textAlign: "center" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "32px", fontWeight: 800, color: "#0a1628", marginBottom: "10px" }}>
          Ready to Order at Factory-Direct Prices?
        </h2>
        <p style={{ fontSize: "14px", color: "#444", marginBottom: "24px", maxWidth: "480px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          Join 2,000+ print shops and brands already stocking with AF Apparels. Apply takes 2 minutes. Approval within 1 business day.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href={loggedIn ? "/account" : "/wholesale/register"}
            style={{ background: "#E8242A", color: "#fff", padding: "13px 30px", fontSize: "16px", borderRadius: "3px", fontWeight: 700, textDecoration: "none", fontFamily: "'Barlow Semi Condensed', sans-serif", letterSpacing: ".04em" }}
          >
            {loggedIn ? "Go to Dashboard" : "Apply for Wholesale Account"}
          </Link>
          <Link
            href="/products"
            style={{ background: "none", color: "#0a1628", padding: "12px 24px", fontSize: "14px", borderRadius: "3px", fontWeight: 700, textDecoration: "none", border: "1.5px solid #0a1628" }}
          >
            Browse Products First
          </Link>
        </div>
      </div>
    </div>
  );
}
