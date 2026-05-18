// frontend/src/app/(customer)/track-order/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Order Received", color: "#f59e0b" },
  confirmed: { label: "Confirmed", color: "#3b82f6" },
  processing: { label: "Processing", color: "#8b5cf6" },
  shipped: { label: "Shipped", color: "#059669" },
  delivered: { label: "Delivered", color: "#059669" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
  refunded: { label: "Refunded", color: "#6b7280" },
};

interface TrackingItem {
  product_name: string;
  sku: string;
  color: string | null;
  size: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface TrackingResult {
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  guest_name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
  courier_service: string | null;
  items: TrackingItem[];
}

const inp: React.CSSProperties = {
  width: "100%", padding: "11px 14px", border: "1.5px solid #E2E0DA",
  borderRadius: "8px", fontSize: "14px", fontFamily: "var(--font-jakarta)",
  outline: "none", boxSizing: "border-box", color: "#2A2830", background: "#fff",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700, color: "#7A7880",
  textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "6px",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiClient.get<TrackingResult>(
        `/api/v1/guest/orders/${encodeURIComponent(orderNumber.trim())}?email=${encodeURIComponent(email.trim())}`
      );
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Order not found. Please check your order number and email.");
    } finally {
      setLoading(false);
    }
  }

  const statusInfo = result ? (STATUS_LABELS[result.status] ?? { label: result.status, color: "#7A7880" }) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F3EF", fontFamily: "var(--font-jakarta)" }}>
      {/* Header */}
      <div style={{ background: "#1B3A5C", borderBottom: "3px solid #E8242A", padding: "20px 32px 18px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(255,255,255,.5)", marginBottom: "4px" }}>
            AF Apparels
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(24px,4vw,40px)", color: "#fff", letterSpacing: ".03em", lineHeight: 1 }}>
            Track Your Order
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Lookup form */}
        <div style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", padding: "28px 24px", marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#7A7880", marginBottom: "20px", lineHeight: 1.6 }}>
            Enter your order number and the email address used at checkout to track your order.
          </p>
          <form onSubmit={handleTrack}>
            <div style={{ marginBottom: "16px" }}>
              <label style={lbl}>Order Number <span style={{ color: "#E8242A" }}>*</span></label>
              <input
                style={inp}
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="AF-000123"
                required
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={lbl}>Email Address <span style={{ color: "#E8242A" }}>*</span></label>
              <input
                type="email"
                style={inp}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !orderNumber.trim() || !email.trim()}
              style={{
                width: "100%", padding: "13px", background: (loading || !orderNumber.trim() || !email.trim()) ? "#E2E0DA" : "#E8242A",
                color: (loading || !orderNumber.trim() || !email.trim()) ? "#aaa" : "#fff",
                border: "none", borderRadius: "8px", fontFamily: "var(--font-bebas)",
                fontSize: "17px", letterSpacing: ".08em",
                cursor: (loading || !orderNumber.trim() || !email.trim()) ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Searching…" : "Track Order"}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "14px 18px", borderRadius: "8px", background: "rgba(232,36,42,.07)", border: "1.5px solid rgba(232,36,42,.25)", color: "#E8242A", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && statusInfo && (
          <div style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#2A2830", letterSpacing: ".04em" }}>
                  {result.order_number}
                </div>
                <div style={{ fontSize: "12px", color: "#7A7880", marginTop: "2px" }}>
                  Placed {new Date(result.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
              <div style={{
                padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700,
                background: `${statusInfo.color}18`,
                color: statusInfo.color,
                border: `1px solid ${statusInfo.color}40`,
              }}>
                {statusInfo.label}
              </div>
            </div>

            {/* Tracking info */}
            {result.tracking_number && (
              <div style={{ background: "rgba(5,150,105,.06)", border: "1px solid rgba(5,150,105,.2)", borderRadius: "8px", padding: "14px 16px", marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#059669", marginBottom: "10px" }}>✓ Your order has shipped</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: "13px", color: "#2A2830", marginBottom: result.tracking_url ? "12px" : "0" }}>
                  {result.carrier && (
                    <div>
                      <span style={{ color: "#7A7880", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: ".06em" }}>Carrier </span>
                      <div style={{ fontWeight: 600 }}>{result.carrier.toUpperCase()}{result.courier_service ? ` — ${result.courier_service}` : ""}</div>
                    </div>
                  )}
                  <div>
                    <span style={{ color: "#7A7880", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: ".06em" }}>Tracking # </span>
                    <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{result.tracking_number}</div>
                  </div>
                </div>
                {result.tracking_url && (
                  <a href={result.tracking_url} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#059669", color: "#fff", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                    Track Package →
                  </a>
                )}
              </div>
            )}

            {/* Items */}
            <div style={{ borderTop: "1px solid #F0EEE9", paddingTop: "16px", marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#7A7880", marginBottom: "10px" }}>
                Items
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <div>
                      <span style={{ fontWeight: 600, color: "#2A2830" }}>{item.product_name}</span>
                      {(item.color || item.size) && (
                        <span style={{ color: "#7A7880", marginLeft: "6px" }}>{[item.color, item.size].filter(Boolean).join(" / ")}</span>
                      )}
                      <span style={{ color: "#7A7880", marginLeft: "6px" }}>x{item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: "#2A2830" }}>{formatCurrency(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div style={{ borderTop: "1px solid #F0EEE9", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7880" }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: "#2A2830" }}>{formatCurrency(result.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7880" }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: result.shipping_cost === 0 ? "#059669" : "#2A2830" }}>
                  {result.shipping_cost === 0 ? "FREE" : formatCurrency(result.shipping_cost)}
                </span>
              </div>
              <div style={{ borderTop: "1.5px solid #E2E0DA", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#2A2830" }}>Total</span>
                <span style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#E8242A", letterSpacing: ".02em" }}>
                  {formatCurrency(result.total)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Back to shopping */}
        <div style={{ textAlign: "center" }}>
          <Link href="/products" style={{ fontSize: "13px", color: "#1A5CFF", fontWeight: 600, textDecoration: "none" }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
