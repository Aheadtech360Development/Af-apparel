import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "AF Apparels — Premium B2B Wholesale Blanks",
  description: "Factory-direct wholesale blank apparel. No minimums, same-day shipping from Dallas, TX.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-jakarta)", background: "#FAFAFA", color: "var(--af-text)" }}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
