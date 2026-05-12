"use client";

import Link from "next/link";
import { PhoneIcon, MailIcon } from "@/components/ui/icons";
import { useAuthStore } from "@/stores/auth.store";

export function Footer() {
  const { isAuthenticated } = useAuthStore();
  const authed = isAuthenticated();

  const cols = [
    {
      h: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "T-Shirts", href: "/products?category=t-shirts" },
        { label: "Hoodies", href: "/products?category=hoodies" },
        { label: "Sweatshirts", href: "/products?category=sweatshirts" },
        { label: "Polos", href: "/products?category=polo-shirts" },
      ],
    },
    {
      h: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Product Specs", href: "/product-specs" },
        { label: "Style Sheets", href: "/style-sheets" },
        { label: "About Us", href: "/about" },
      ],
    },
    {
      h: "Account",
      links: [
        { label: "Apply for Wholesale", href: authed ? "/account" : "/wholesale/register" },
        { label: authed ? "My Account" : "Log In", href: authed ? "/account" : "/login" },
        { label: "Order History", href: "/account/orders" },
      ],
    },
    {
      h: "Support",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Track Order", href: "/track-order" },
        { label: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
  ];

  return (
    <footer style={{ background: "#1B3A5C", borderTop: "1px solid rgba(255,255,255,.08)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "52px 32px 40px", display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr", gap: "32px" }} className="footer-grid-responsive">
        <div>
          <p style={{ fontSize: "15px", color: "#d3d0d0", lineHeight: 1.75, fontWeight: 500 }}>
            Factory-direct wholesale blank apparel. Serving 2,000+ businesses across the US from our Dallas, TX warehouse.<br /><br />
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><PhoneIcon size={15} color="#d3d0d0" /> +1 (469) 367-9753</span><br />
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><MailIcon size={15} color="#d3d0d0" /> info@afblanks.com</span>
          </p>
        </div>
        {cols.map(col => (
          <div key={col.h}>
            <h5 style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".14em", color: "#fff", marginBottom: "14px" }}>{col.h}</h5>
            {col.links.map(link => (
              <Link
                key={link.label}
                href={link.href}
                style={{ display: "block", fontSize: "15px", color: "#d3d0d0", marginBottom: "8px", textDecoration: "none", transition: "color .2s", fontWeight: 500 }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.04)", padding: "18px 32px", maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#d3d0d0", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginRight: "6px" }}>Accepted:</span>
          {["VISA", "MC", "AMEX", "ACH", "WIRE", "NET 30"].map(m => (
            <span key={m} style={{ background: "rgba(255,255,255,.08)", color: "#d3d0d0", padding: "5px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: 800, border: "1px solid rgba(255,255,255,.15)", letterSpacing: ".04em" }}>{m}</span>
          ))}
        </div>
        <div style={{ fontSize: "13px", color: "#d3d0d0", letterSpacing: ".02em", fontWeight: 500 }}>
          © {new Date().getFullYear()} AF Apparels · Dallas, TX · All rights reserved
        </div>
      </div>
    </footer>
  );
}
