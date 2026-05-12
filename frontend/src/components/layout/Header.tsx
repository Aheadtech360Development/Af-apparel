"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { apiClient } from "@/lib/api-client";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ShoppingCartIcon } from "@/components/ui/icons";
import { Building2, Star, Printer, Tag, FileText, Ruler, PenLine, Mail, Lock } from "lucide-react";

const BROWSE_LINKS = [
  { href: "/products?category=t-shirts", label: "T-Shirts" },
  { href: "/products?category=short-sleeve", label: "Short Sleeves" },
  { href: "/products?category=long-sleeve", label: "Long Sleeves" },
  { href: "/products?category=hoodies", label: "Hoodies" },
  { href: "/products?category=sweatshirts", label: "Sweatshirts" },
  { href: "/products?category=crop-tops", label: "Crop Tops" },
  { href: "/products?category=v-neck", label: "V-Neck" },
  { href: "/products?category=polo-shirts", label: "Polos" },
  { href: "/products?category=youth", label: "Youth" },
  { href: "/products", label: "New Arrivals" },
  { href: "/products", label: "All Products" },
];

export function Header() {
  const { user, isAuthenticated, isAdmin, clearAuth, isLoading } = useAuthStore();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoading || !user || user.is_admin) return;
    function loadCount() {
      apiClient
        .get<{ items: { quantity: number }[] }>("/api/v1/cart")
        .then((r) => {
          const items = r?.items ?? [];
          setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
        })
        .catch(() => {});
    }
    loadCount();
    window.addEventListener("cart_updated", loadCount);
    return () => window.removeEventListener("cart_updated", loadCount);
  }, [isLoading, user]);

  useEffect(() => {
    if (isLoading || user) return;
    function readGuestCount() {
      try {
        const entries: { quantity: number }[] = JSON.parse(localStorage.getItem("af_guest_cart") || "[]");
        setCartCount(entries.reduce((s, i) => s + i.quantity, 0));
      } catch {
        setCartCount(0);
      }
    }
    readGuestCount();
    window.addEventListener("storage", readGuestCount);
    window.addEventListener("af_guest_cart_updated", readGuestCount);
    return () => {
      window.removeEventListener("storage", readGuestCount);
      window.removeEventListener("af_guest_cart_updated", readGuestCount);
    };
  }, [isLoading, user]);

  async function handleLogout() {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    clearAuth();
    setCartCount(0);
    router.push("/login");
  }

  return (
    <>
      <AnnouncementBar />

      {/* Main header */}
      <header style={{ background: "#f4f3ef", borderBottom: "3px solid #E8242A" }} className="sticky top-0 z-40">
        <div className="header-inner" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "100px", gap: "24px" }}>

          {/* Logo */}
          <Link href="/" className="header-logo" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/Af-apparel logo.png"
              alt="AF Apparels Logo"
              style={{ height: "70px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex" style={{ gap: "4px", alignItems: "center" }}>
            {([
              { href: "/products", label: "Shop All" },
              { href: "/products?category=t-shirts", label: "T-Shirts" },
              { href: "/products?category=hoodies", label: "Hoodies" },
              { href: "/products?category=sweatshirts", label: "Sweatshirts" },
            ] as { href: string; label: string }[]).map(({ href, label }) => (
              <Link key={href} href={href} style={{ color: "#1B3A5C", fontSize: "13px", fontWeight: 600, textDecoration: "none", letterSpacing: ".04em", padding: "8px 14px", borderRadius: "4px", transition: "all .2s", textTransform: "uppercase" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#E8242A"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(27,58,92,.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#1B3A5C"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                {label}
              </Link>
            ))}

            {/* Resources dropdown */}
            <div ref={resourcesRef} style={{ position: "relative" }}>
              <button
                onClick={() => setResourcesOpen(o => !o)}
                style={{ color: "#1B3A5C", fontSize: "13px", fontWeight: 600, background: resourcesOpen ? "rgba(27,58,92,.07)" : "transparent", border: "none", letterSpacing: ".04em", padding: "8px 14px", borderRadius: "4px", transition: "all .2s", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#E8242A"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(27,58,92,.07)"; }}
                onMouseLeave={e => { if (!resourcesOpen) { (e.currentTarget as HTMLButtonElement).style.color = "#1B3A5C"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; } }}
              >
                Resources
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginTop: "1px", opacity: 0.6, transform: resourcesOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {resourcesOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, marginTop: "6px", background: "#fff", border: "1px solid #E2E0DA", borderRadius: "8px", padding: "6px", minWidth: "200px", boxShadow: "0 8px 24px rgba(0,0,0,.1)", zIndex: 100 }}>
                  {([
                    { href: "/about", label: "About Us", icon: <Building2 size={15} /> },
                    { href: "/reviews", label: "Customer Reviews", icon: <Star size={15} /> },
                    { href: "/print-guide", label: "Print Guide", icon: <Printer size={15} /> },
                    { href: "/private-label", label: "Private Label", icon: <Tag size={15} /> },
                    { href: "/style-sheets", label: "Style Sheets", icon: <FileText size={15} /> },
                    { href: "/product-specs", label: "Product Specs", icon: <Ruler size={15} /> },
                    { href: "/blog", label: "Blog", icon: <PenLine size={15} /> },
                    { href: "/contact", label: "Contact Us", icon: <Mail size={15} /> },
                    { href: "/privacy-policy", label: "Privacy Policy", icon: <Lock size={15} /> },
                  ] as { href: string; label: string; icon: React.ReactNode }[]).map(({ href, label, icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setResourcesOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", color: "#1B3A5C", fontSize: "13px", fontWeight: 600, textDecoration: "none", borderRadius: "5px", transition: "background .15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(27,58,92,.06)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ flexShrink: 0, color: "#64748B", display: "flex" }}>{icon}</span>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Admin link */}
            {isAdmin() && (
              <Link href="/admin/dashboard" style={{ color: "#1B3A5C", fontSize: "13px", fontWeight: 600, textDecoration: "none", letterSpacing: ".04em", padding: "8px 14px", borderRadius: "4px", transition: "all .2s", textTransform: "uppercase" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#E8242A"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(27,58,92,.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#1B3A5C"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                Admin Panel
              </Link>
            )}

            {/* Authenticated non-admin links */}
            {isAuthenticated() && !isAdmin() && (
              <>
                <Link href="/quick-order" style={{ color: "#1B3A5C", fontSize: "13px", fontWeight: 600, textDecoration: "none", letterSpacing: ".04em", padding: "8px 14px", borderRadius: "4px", transition: "all .2s", textTransform: "uppercase" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#E8242A"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(27,58,92,.07)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#1B3A5C"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                  Quick Order
                </Link>
                <Link href="/account" style={{ color: "#1B3A5C", fontSize: "13px", fontWeight: 600, textDecoration: "none", letterSpacing: ".04em", padding: "8px 14px", borderRadius: "4px", transition: "all .2s", textTransform: "uppercase" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#E8242A"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(27,58,92,.07)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#1B3A5C"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                  My Account
                </Link>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Cart */}
            {!isAdmin() && (
              <Link href="/cart" style={{ position: "relative", background: "transparent", border: "1.5px solid #CBD5E1", color: "#1B3A5C", padding: "9px 14px", borderRadius: "5px", cursor: "pointer", fontSize: "18px", transition: "all .2s", display: "flex", alignItems: "center" }}>
                <ShoppingCartIcon size={18} color="#1B3A5C" />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#E8242A", color: "#fff", fontSize: "9px", fontWeight: 800, width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <div className="hidden md:flex" style={{ gap: "10px", alignItems: "center" }}>
              {isAuthenticated() ? (
                <>
                  <span style={{ fontSize: "13px", color: "#1B3A5C" }}>
                    {user?.first_name}
                    {isAdmin() && <span style={{ marginLeft: "6px", fontSize: "10px", background: "rgba(27,58,92,.1)", color: "#1B3A5C", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>Admin</span>}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{ background: "transparent", color: "#e8242a", padding: "10px 18px", fontSize: "13px", border: "1.5px solid #e8242a", borderRadius: "5px", cursor: "pointer", fontWeight: 700, transition: "all .2s" }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" style={{ background: "transparent", color: "#1B3A5C", padding: "10px 18px", fontSize: "13px", border: "1.5px solid #1B3A5C", borderRadius: "5px", fontWeight: 700, textDecoration: "none", transition: "all .2s" }}>
                    Sign In
                  </Link>
                  <Link href="/wholesale/register" style={{ background: "#E8242A", color: "#fff", padding: "10px 22px", fontSize: "13px", borderRadius: "5px", fontWeight: 700, textDecoration: "none", transition: "all .2s", border: "none" }}>
                    Apply Now
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
              style={{ padding: "6px", color: "#1B3A5C", background: "transparent", border: "1.5px solid #CBD5E1", borderRadius: "5px", cursor: "pointer" }}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Browse Bar */}
        {/* <div style={{ background: "#1B3A5C" }} className="hidden md:block">
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", overflowX: "auto" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(255,255,255,.45)", whiteSpace: "nowrap", padding: "8px 14px 8px 0", flexShrink: 0 }}>Browse:</span>
            {BROWSE_LINKS.map(({ href, label }) => (
              <Link key={label} href={href}
                style={{ color: "rgba(255,255,255,.75)", fontSize: "12px", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", padding: "8px 12px", display: "block", transition: "color .15s", letterSpacing: ".02em" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.75)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div> */}

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "#1B3A5C", borderTop: "1px solid rgba(255,255,255,.12)", padding: "12px 20px" }} className="md:hidden">
            {[
              { href: "/products", label: "Shop All" },
              { href: "/products?category=t-shirts", label: "T-Shirts" },
              { href: "/products?category=hoodies", label: "Hoodies" },
              { href: "/products?category=sweatshirts", label: "Sweatshirts" },
              { href: "#", label: "Resources" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 0", color: "#d3d0d0", fontSize: "13px", fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                {label}
              </Link>
            ))}
            {isAdmin() && (
              <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 0", color: "#d3d0d0", fontSize: "13px", fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                Admin Panel
              </Link>
            )}
            {isAuthenticated() && !isAdmin() && (
              <>
                <Link href="/quick-order" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 0", color: "#d3d0d0", fontSize: "13px", fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                  Quick Order
                </Link>
                <Link href="/account" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 0", color: "#d3d0d0", fontSize: "13px", fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                  My Account
                </Link>
                <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 0", color: "#d3d0d0", fontSize: "13px", fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
              </>
            )}
            {!isAuthenticated() && (
              <>
                <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 0", color: "#d3d0d0", fontSize: "13px", fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <Link href="/wholesale/register" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 0", color: "#7bb3ff", fontSize: "13px", fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                  Apply for Wholesale
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px 0", color: "#7bb3ff", fontSize: "13px", fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: ".04em" }}>
                  Log In
                </Link>
              </>
            )}
            {isAuthenticated() && (
              <button onClick={handleLogout} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 0", color: "#d3d0d0", fontSize: "13px", fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: ".04em", borderTop: "1px solid rgba(255,255,255,.06)" }}>
                Sign out
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
}
