"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const STEPS = [
  { label: "Shipping", href: "/checkout/address", step: 1 },
  { label: "Payment", href: "/checkout/payment", step: 2 },
  { label: "Review", href: "/checkout/review", step: 3 },
  { label: "Confirmed", href: "/checkout/confirmed", step: 4 },
];

function getActiveStep(pathname: string): number {
  if (pathname.includes("/checkout/confirmed")) return 4;
  if (pathname.includes("/checkout/review")) return 3;
  if (pathname.includes("/checkout/payment")) return 2;
  return 1;
}

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const pathname = usePathname();
  const activeStep = getActiveStep(pathname);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F8F6", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Progress bar — hidden on invoice payment page */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E2DE", padding: "20px 24px", display: pathname.includes('/checkout/invoice') ? 'none' : undefined }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", alignItems: "center" }}>
          {STEPS.map((step, i) => {
            const isActive = activeStep === step.step;
            const isDone = activeStep > step.step;
            return (
              <div key={step.href} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? "#1C3557" : isDone ? "#6B6B6B" : "#9B9B9B", textDecoration: isActive ? "underline" : "none" }}>
                    {step.label}
                  </span>
                </div>
                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#E2E2DE", margin: "0 8px" }}>—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 60px" }}>
        {children}
      </div>
    </div>
  );
}
