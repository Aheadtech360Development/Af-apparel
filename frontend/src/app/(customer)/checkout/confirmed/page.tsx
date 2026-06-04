"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkout.store";
import type { ShippingMethod } from "@/stores/checkout.store";
import { formatCurrency } from "@/lib/utils";

const SHIPPING_LABELS: Record<string, string> = {
  standard: "Standard Ground",
  expedited: "Expedited (2-Day)",
  will_call: "Will Call Pickup",
  freight: "Freight / LTL",
};

export default function CheckoutConfirmedPage() {
  const router = useRouter();
  const {
    confirmedOrderId,
    confirmedOrderNumber,
    confirmedOrderTotal,
    confirmedUnits,
    confirmedColorSummary,
    confirmedProductName,
    confirmedShippingMethod,
    confirmedShippingCost,
    confirmedPaymentMethod,
    setConfirmedOrder,
  } = useCheckoutStore();

  const [ready, setReady] = useState(false);

  // On mount: if Zustand store is empty (e.g. full-page navigation wiped it),
  // recover from sessionStorage before deciding whether to redirect.
  useEffect(() => {
    if (!confirmedOrderId && !confirmedOrderNumber) {
      try {
        const stored = sessionStorage.getItem("af_confirmed_order");
        if (stored) {
          const data = JSON.parse(stored) as {
            id: string; number: string; total: number;
            units: number; colorSummary: string; productName: string;
            shippingMethod: ShippingMethod; shippingCost?: number;
            paymentMethod?: string; isGuest?: boolean;
          };
          setConfirmedOrder(data);
          setReady(true);
          return;
        }
      } catch {
        // ignore parse errors
      }
      // Nothing in store or sessionStorage — direct navigation, redirect away
      router.replace("/cart");
    } else {
      setReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready || !confirmedOrderNumber) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#7A7880", fontSize: "14px" }}>
        Loading&hellip;
      </div>
    );
  }

  const orderNum = confirmedOrderNumber.startsWith("AF-")
    ? confirmedOrderNumber
    : `AF-${confirmedOrderNumber}`;

  const shippingLabel = SHIPPING_LABELS[confirmedShippingMethod] ?? "Standard Ground";

  return (
    <div style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Success */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "44px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1.15, marginBottom: "12px" }}>
          Order Confirmed
        </h1>

        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "14px", color: "#6B6B6B", marginBottom: "12px" }}>
          {orderNum}
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#6B6B6B", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
          Your order has been placed. You will receive a confirmation email shortly.
        </p>
      </div>

      {/* Order detail box */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #E2E2DE",
        padding: "24px", textAlign: "left", margin: "28px 0",
      }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", color: "#6B6B6B", marginBottom: "16px" }}>
          Order Details
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", fontSize: "13px" }}>
            <span style={{ color: "#7A7880", flexShrink: 0 }}>Product</span>
            <span style={{ fontWeight: 700, color: "#2A2830", textAlign: "right" }}>{confirmedProductName}</span>
          </div>

          {confirmedColorSummary && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", fontSize: "13px" }}>
              <span style={{ color: "#7A7880", flexShrink: 0 }}>Colors</span>
              <span style={{ fontWeight: 600, color: "#2A2830", textAlign: "right" }}>{confirmedColorSummary}</span>
            </div>
          )}

          <div style={{ borderTop: "1px solid #F0EEE9" }} />

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px" }}>
            <span style={{ color: "#7A7880" }}>Shipping</span>
            <span style={{ fontWeight: 600, color: "#2A2830" }}>
              {shippingLabel}{confirmedShippingCost > 0 ? ` — ${formatCurrency(confirmedShippingCost)}` : " — FREE"}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px" }}>
            <span style={{ color: "#7A7880" }}>Payment</span>
            <span style={{ fontWeight: 600, color: "#2A2830" }}>
              {confirmedPaymentMethod === "ach" ? "ACH / Bank Transfer" : "Credit Card"}
            </span>
          </div>

          <div style={{ borderTop: "1px solid #E2E2DE" }} />

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>Total Charged</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: "#1C3557", fontWeight: 600 }}>
              {formatCurrency(confirmedOrderTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link
          href={(() => {
            try { const d = JSON.parse(sessionStorage.getItem("af_confirmed_order") || "{}"); return d.isGuest ? "/track-order" : "/account/orders"; } catch { return "/account/orders"; }
          })()}
          style={{
            display: "block", padding: "14px", background: "#1C3557", color: "#fff",
            textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px", fontWeight: 500, transition: "background .2s",
          }}
        >
          {(() => { try { const d = JSON.parse(sessionStorage.getItem("af_confirmed_order") || "{}"); return d.isGuest ? "Track Your Order →" : "Track Your Order →"; } catch { return "Track Your Order →"; } })()}
        </Link>
        <a
          href="/products"
          style={{
            display: "block", padding: "14px", background: "#FFFFFF", color: "#1C3557",
            border: "1px solid #1C3557", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500,
          }}
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
