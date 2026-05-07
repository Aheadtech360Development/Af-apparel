export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

const _API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await fetch(`${_API}/api/v1/pages-seo/home`, { next: { revalidate: 300 } }).then(r => r.json());
    return {
      title: seo.meta_title ?? "AF Apparels — Wholesale Blank Apparel",
      description: seo.meta_description ?? "Factory-direct wholesale blank apparel. Dallas, TX. XS–3XL, no MOQ on in-stock items.",
      keywords: seo.keywords ?? undefined,
      openGraph: seo.og_image_url ? { images: [{ url: seo.og_image_url }] } : undefined,
    };
  } catch {
    return { title: "AF Apparels — Wholesale Blank Apparel" };
  }
}
import { Footer } from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
// import { BrandLogos } from "@/components/home/BrandLogos";
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
        {/* <BrandLogos /> */}
        <Certifications />
        <FaqSection />
        {/* S13: CTA */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
