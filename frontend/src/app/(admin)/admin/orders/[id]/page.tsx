"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { apiClient } from "@/lib/api-client";

interface OrderItem {
  id: string;
  sku: string;
  product_name: string;
  color: string | null;
  size: string | null;
  quantity: number;
  unit_price: string;
  line_total: string;
}

interface AdminOrder {
  id: string;
  order_number: string;
  company_name: string;
  company_id: string;
  status: string;
  payment_status: string;
  po_number: string | null;
  order_notes: string | null;
  tracking_number: string | null;
  courier: string | null;
  courier_service: string | null;
  shipped_at: string | null;
  qb_invoice_id: string | null;
  subtotal: string;
  shipping_cost: string;
  tax_amount?: string;
  total: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const COURIERS = [
  { id: "fedex", name: "FedEx",  icon: "📦", services: ["Ground", "2-Day", "Overnight", "Express Saver"] },
  { id: "ups",   name: "UPS",    icon: "🟤", services: ["Ground", "2-Day Air", "Next Day Air", "3-Day Select"] },
  { id: "usps",  name: "USPS",   icon: "🦅", services: ["Priority Mail", "Priority Express", "First Class", "Parcel Select"] },
  { id: "dhl",   name: "DHL",    icon: "🟡", services: ["Express", "Economy Select", "Expedited"] },
  { id: "other", name: "Other",  icon: "🚚", services: ["Standard", "Express"] },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:    { bg: "rgba(217,119,6,.1)",   color: "#D97706" },
  confirmed:  { bg: "rgba(26,92,255,.1)",   color: "#1A5CFF" },
  processing: { bg: "rgba(99,102,241,.1)",  color: "#6366F1" },
  shipped:    { bg: "rgba(139,92,246,.1)",  color: "#8B5CF6" },
  delivered:  { bg: "rgba(5,150,105,.1)",   color: "#059669" },
  cancelled:  { bg: "rgba(232,36,42,.1)",   color: "#E8242A" },
  authorized: { bg: "rgba(245,158,11,.1)",  color: "#D97706" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: "rgba(0,0,0,.06)", color: "#555" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, textTransform: "capitalize" as const }}>
      {status}
    </span>
  );
}

function generateTrackingNumber(courier: string): string {
  const prefix: Record<string, string> = {
    fedex: "7489",
    ups:   "1Z",
    usps:  "9400",
    dhl:   "JD",
    other: "TRK",
  };
  const p = prefix[courier] ?? "TRK";
  const random = Math.random().toString(36).substring(2, 12).toUpperCase();
  const ts = Date.now().toString().slice(-6);
  return `${p}${ts}${random}`;
}

const LabelStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: ".08em",
  color: "#7A7880", marginBottom: "6px", display: "block",
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Courier section state
  const [selectedCourier, setSelectedCourier] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isShipping, setIsShipping] = useState(false);

  useEffect(() => {
    adminService.getOrder(id).then((d) => {
      const o = d as AdminOrder;
      setOrder(o);
      setStatus(o.status);
      setTracking(o.tracking_number ?? "");
      if (o.courier) setSelectedCourier(o.courier);
      if (o.courier_service) setSelectedService(o.courier_service);
      if (o.tracking_number) setTrackingNumber(o.tracking_number);
    });
  }, [id]);

  function handleCourierSelect(courierId: string) {
    setSelectedCourier(courierId);
    setSelectedService("");
    setTrackingNumber(generateTrackingNumber(courierId));
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true); setMsg(null);
    try {
      await adminService.updateOrder(id, { status, tracking_number: tracking || undefined });
      setMsg({ text: "Order updated successfully.", ok: true });
      setOrder(prev => prev ? { ...prev, status, tracking_number: tracking || null } : prev);
    } catch {
      setMsg({ text: "Failed to update order.", ok: false });
    } finally { setIsSaving(false); }
  }

  async function handleSyncQB() {
    setIsSyncing(true); setMsg(null);
    try {
      await adminService.syncOrderToQb(id);
      setMsg({ text: "QuickBooks sync queued.", ok: true });
    } catch {
      setMsg({ text: "QB sync failed.", ok: false });
    } finally { setIsSyncing(false); }
  }

  async function handleMarkShipped() {
    if (!selectedCourier || !selectedService) return;
    setIsShipping(true); setMsg(null);
    try {
      await apiClient.patch(`/api/v1/admin/orders/${id}/status`, {
        status: "shipped",
        tracking_number: trackingNumber || undefined,
        courier: selectedCourier,
        courier_service: selectedService,
      });
      const courierLabel = COURIERS.find(c => c.id === selectedCourier)?.name ?? selectedCourier;
      setMsg({ text: `Order marked as shipped via ${courierLabel} ${selectedService}.`, ok: true });
      setOrder(prev => prev ? {
        ...prev,
        status: "shipped",
        tracking_number: trackingNumber || null,
        courier: selectedCourier,
        courier_service: selectedService,
        shipped_at: new Date().toISOString(),
      } : prev);
      setStatus("shipped");
      setTracking(trackingNumber);
    } catch {
      setMsg({ text: "Failed to mark as shipped.", ok: false });
    } finally { setIsShipping(false); }
  }

  async function handleCapturePayment() {
    setIsCapturing(true); setMsg(null);
    try {
      await apiClient.post(`/api/v1/admin/orders/${id}/capture`, {});
      setMsg({ text: "Payment captured successfully.", ok: true });
      setOrder(prev => prev ? { ...prev, payment_status: "paid" } : prev);
    } catch {
      setMsg({ text: "Failed to capture payment.", ok: false });
    } finally { setIsCapturing(false); }
  }

  if (!order) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "320px" }}>
        <div style={{ fontSize: "13px", color: "#aaa" }}>Loading order…</div>
      </div>
    );
  }

  const courierObj = COURIERS.find(c => c.id === selectedCourier);
  const courierDisplayName = COURIERS.find(c => c.id === order.courier)?.name ?? order.courier;

  const timelineEvents = [
    order.shipped_at ? {
      icon: "📦",
      text: `Shipped via ${courierDisplayName ?? "courier"}${order.courier_service ? ` ${order.courier_service}` : ""}`,
      sub: order.tracking_number ? `Tracking: ${order.tracking_number}` : "",
      time: order.shipped_at,
      color: "#059669",
    } : null,
    {
      icon: "✅",
      text: "Order placed",
      sub: `${order.company_name} · ${order.payment_status}`,
      time: order.created_at,
      color: "#1A5CFF",
    },
  ].filter(Boolean) as { icon: string; text: string; sub: string; time: string; color: string }[];

  return (
    <div style={{ fontFamily: "var(--font-jakarta)", maxWidth: "860px" }}>
      {/* Back */}
      <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#1A5CFF", cursor: "pointer", fontSize: "13px", fontWeight: 700, padding: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
        ← Back to Orders
      </button>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", color: "#2A2830", letterSpacing: ".04em", lineHeight: 1 }}>
            {order.order_number}
          </h1>
          <p style={{ fontSize: "13px", color: "#7A7880", marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{order.company_name}</span>
            <span>·</span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
            <span>·</span>
            <StatusBadge status={order.status} />
            <StatusBadge status={order.payment_status} />
          </p>
        </div>
        <button onClick={handleSyncQB} disabled={isSyncing}
          style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "6px", padding: "10px 18px", fontSize: "13px", fontWeight: 700, cursor: "pointer", color: "#2A2830", opacity: isSyncing ? .5 : 1 }}>
          {isSyncing ? "Syncing…" : "🔄 Sync to QuickBooks"}
        </button>
      </div>

      {/* Feedback message */}
      {msg && (
        <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: msg.ok ? "rgba(5,150,105,.1)" : "rgba(232,36,42,.1)", color: msg.ok ? "#059669" : "#E8242A", border: `1px solid ${msg.ok ? "rgba(5,150,105,.2)" : "rgba(232,36,42,.2)"}` }}>
          {msg.text}
        </div>
      )}

      {/* ── PAYMENT CAPTURE ALERT ── */}
      {order.payment_status === "authorized" && (
        <div style={{ background: "#fff8f0", border: "1.5px solid #fed7aa", borderRadius: "10px", padding: "20px 24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <h4 style={{ fontWeight: 700, color: "#c2410c", marginBottom: "4px", fontSize: "15px" }}>⏰ Payment Authorized</h4>
              <p style={{ fontSize: "13px", color: "#7A7880" }}>Capture payment before authorization expires</p>
            </div>
            <button onClick={handleCapturePayment} disabled={isCapturing}
              style={{ background: "#059669", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "14px", opacity: isCapturing ? .6 : 1, whiteSpace: "nowrap" as const }}>
              {isCapturing ? "Capturing…" : `Capture $${Number(order.total).toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      {/* ── SHIPPING & COURIER ── */}
      <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", padding: "24px", marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".05em", color: "#2A2830", marginBottom: "14px" }}>
          SHIPPING & COURIER
        </h3>

        {order.status === "shipped" && order.courier && (
          <div style={{ fontSize: "12px", color: "#059669", fontWeight: 600, marginBottom: "14px", padding: "8px 12px", background: "rgba(5,150,105,.08)", borderRadius: "6px" }}>
            ✓ Shipped via {courierDisplayName} {order.courier_service}
            {order.tracking_number && ` · Tracking: ${order.tracking_number}`}
            {order.shipped_at && ` · ${new Date(order.shipped_at).toLocaleDateString()}`}
          </div>
        )}

        {/* Courier grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "8px", marginBottom: "16px" }}>
          {COURIERS.map(courier => (
            <div key={courier.id}
              onClick={() => handleCourierSelect(courier.id)}
              style={{
                border: selectedCourier === courier.id ? "2px solid #1A5CFF" : "1.5px solid #E2E0DA",
                borderRadius: "8px", padding: "12px 8px", textAlign: "center" as const,
                cursor: "pointer",
                background: selectedCourier === courier.id ? "rgba(26,92,255,.05)" : "#fff",
                transition: "all .15s",
              }}>
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>{courier.icon}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: selectedCourier === courier.id ? "#1A5CFF" : "#2A2830" }}>
                {courier.name}
              </div>
            </div>
          ))}
        </div>

        {/* Service + Tracking */}
        {selectedCourier && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={LabelStyle}>Service Type</label>
              <select value={selectedService} onChange={e => setSelectedService(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E0DA", borderRadius: "6px", fontSize: "14px", fontFamily: "var(--font-jakarta)", background: "#fff" }}>
                <option value="">Select service…</option>
                {courierObj?.services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={LabelStyle}>Tracking Number</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Auto-generated or enter…"
                  style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #E2E0DA", borderRadius: "6px", fontSize: "13px", fontFamily: "var(--font-jakarta)", boxSizing: "border-box" as const }} />
                <button type="button" onClick={() => setTrackingNumber(generateTrackingNumber(selectedCourier))}
                  title="Regenerate"
                  style={{ padding: "10px 12px", border: "1.5px solid #E2E0DA", borderRadius: "6px", background: "#fff", cursor: "pointer", fontSize: "14px" }}>
                  🔄
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedCourier && selectedService && (
          <button onClick={handleMarkShipped} disabled={isShipping}
            style={{ background: "#059669", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: isShipping ? .6 : 1 }}>
            {isShipping ? "Marking shipped…" : `✓ Mark as Shipped via ${courierObj?.name} ${selectedService}`}
          </button>
        )}
      </div>

      {/* ── STATUS UPDATE ── */}
      <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", padding: "24px", marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".05em", color: "#2A2830", marginBottom: "16px" }}>
          UPDATE ORDER
        </h3>
        <form onSubmit={handleUpdate} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={LabelStyle}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              style={{ padding: "10px 14px", border: "1.5px solid #E2E0DA", borderRadius: "6px", fontSize: "14px", fontFamily: "var(--font-jakarta)", background: "#fff" }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={LabelStyle}>Tracking #</label>
            <input type="text" value={tracking} onChange={e => setTracking(e.target.value)}
              placeholder="Enter tracking number"
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E0DA", borderRadius: "6px", fontSize: "14px", fontFamily: "var(--font-jakarta)", boxSizing: "border-box" as const }} />
          </div>
          <button type="submit" disabled={isSaving}
            style={{ background: "#1A5CFF", color: "#fff", border: "none", padding: "11px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: isSaving ? .6 : 1 }}>
            {isSaving ? "Saving…" : "Update Order"}
          </button>
        </form>
      </div>

      {/* ── ORDER ITEMS ── */}
      <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", padding: "24px", marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".05em", color: "#2A2830", marginBottom: "16px" }}>ORDER ITEMS</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #E2E0DA" }}>
              {["Product", "SKU", "Color / Size", "Qty", "Unit Price", "Total"].map(h => (
                <th key={h} style={{ textAlign: h === "Qty" || h === "Unit Price" || h === "Total" ? "right" as const : "left" as const, padding: "10px 12px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".06em", color: "#7A7880" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: i < order.items.length - 1 ? "1px solid #F4F3EF" : "none" }}>
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#2A2830" }}>{item.product_name}</div>
                </td>
                <td style={{ padding: "14px 12px", fontSize: "12px", color: "#7A7880", fontFamily: "monospace" }}>{item.sku}</td>
                <td style={{ padding: "14px 12px" }}>
                  {item.color && <span style={{ fontSize: "13px", color: "#2A2830", marginRight: "6px" }}>{item.color}</span>}
                  {item.size && <span style={{ background: "#F4F3EF", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, color: "#2A2830" }}>{item.size}</span>}
                  {!item.color && !item.size && <span style={{ color: "#aaa" }}>—</span>}
                </td>
                <td style={{ padding: "14px 12px", textAlign: "right" as const, fontWeight: 700, color: "#2A2830" }}>{item.quantity}</td>
                <td style={{ padding: "14px 12px", textAlign: "right" as const, color: "#7A7880" }}>${Number(item.unit_price).toFixed(2)}</td>
                <td style={{ padding: "14px 12px", textAlign: "right" as const, fontWeight: 700, fontFamily: "var(--font-bebas)", fontSize: "16px", color: "#2A2830" }}>${Number(item.line_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ borderTop: "2px solid #E2E0DA", marginTop: "16px", paddingTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ minWidth: "260px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#7A7880" }}>
                <span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#7A7880" }}>
                <span>Shipping</span><span>${Number(order.shipping_cost).toFixed(2)}</span>
              </div>
              {order.tax_amount && Number(order.tax_amount) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#7A7880" }}>
                  <span>Tax</span><span>${Number(order.tax_amount).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#2A2830", borderTop: "1px solid #E2E0DA", paddingTop: "10px", marginTop: "4px" }}>
                <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", padding: "24px" }}>
        <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".05em", color: "#2A2830", marginBottom: "20px" }}>
          TIMELINE
        </h3>
        <div style={{ position: "relative", paddingLeft: "28px" }}>
          <div style={{ position: "absolute", left: "8px", top: "8px", bottom: "8px", width: "2px", background: "#E2E0DA" }} />
          {timelineEvents.map((event, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "20px", position: "relative", alignItems: "flex-start" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: event.color, border: "2px solid #fff",
                boxShadow: `0 0 0 2px ${event.color}`,
                flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center",
                justifyContent: "center", marginLeft: "-14px", marginTop: "2px",
              }}>
                <span style={{ fontSize: "9px" }}>{event.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#2A2830" }}>{event.text}</div>
                {event.sub && <div style={{ fontSize: "12px", color: "#7A7880", marginTop: "2px" }}>{event.sub}</div>}
                <div style={{ fontSize: "11px", color: "#bbb", marginTop: "4px" }}>
                  {new Date(event.time).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          {order.po_number && (
            <div style={{ fontSize: "12px", color: "#aaa", paddingLeft: "6px" }}>
              PO: {order.po_number}
              {order.qb_invoice_id && ` · QB Invoice: ${order.qb_invoice_id}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
