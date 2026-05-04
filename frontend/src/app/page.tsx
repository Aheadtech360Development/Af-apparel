export const dynamic = "force-dynamic";

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import { BrandLogos } from "@/components/home/BrandLogos";
import CategoryGrid from "@/components/home/CategoryGrid";
import { BestSellers } from "@/components/home/BestSellers";
import HowItWorks from "@/components/home/HowItWorks";
import WhoWeServe from "@/components/home/WhoWeServe";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Certifications from "@/components/home/Certifications";
import FaqSection from "@/components/home/FaqSection";
import CtaSection from "@/components/home/CtaSection";
import { productsService } from "@/services/products.service";

export default async function HomePage() {
  let categories: { id: string; name: string; slug: string }[] = [];
  try {
    categories = await productsService.getCategories();
  } catch {
    // Backend unreachable from SSR
  }

  return (
    <>
      <main style={{ fontFamily: "var(--font-jakarta)" }}>
        {/* S3: Category Sub-Nav */}
        <div style={{ background: "#F4F6F9", borderBottom: "1px solid #E2E8F0", padding: "0 24px" }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto", display: "flex", alignItems: "center", gap: "24px", padding: "8px 0", fontSize: "12px", overflowX: "auto" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#94A3B8", whiteSpace: "nowrap" }}>Browse:</span>
            <Link href="/products?category=t-shirts" style={{ color: "#1B3A5C", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>T-Shirts</Link>
            <Link href="/products?category=hoodies" style={{ color: "#64748B", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>Hoodies &amp; Sweatshirts</Link>
            <Link href="/products?category=polo-shirts" style={{ color: "#64748B", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>Polos</Link>
            <Link href="/products?category=long-sleeve" style={{ color: "#64748B", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>Long Sleeve</Link>
            <Link href="/products?category=crop-tops" style={{ color: "#64748B", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>Crop Tops</Link>
            <Link href="/products?category=youth" style={{ color: "#64748B", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>Youth</Link>
            <Link href="/products" style={{ color: "#64748B", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>New Arrivals</Link>
            <Link href="/products" style={{ color: "#64748B", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>All Products</Link>
            <span style={{ marginLeft: "auto", fontSize: "11px", color: "#059669", fontWeight: 700, whiteSpace: "nowrap" }}>✓ 50+ Colors · XS–3XL · No MOQ on In-Stock</span>
          </div>
        </div>

        {/* S4: Hero */}
        <HeroSection />
        <TrustStrip />
        <CategoryGrid categories={categories} />
        <BestSellers />
        <HowItWorks />
        <WhoWeServe />
        {/* S10: Why Choose AF */}
        <WhyChooseUs />
        {/* S11: Client Logos */}
        <BrandLogos />
        <Certifications />
        <FaqSection />
        {/* S13: CTA */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
