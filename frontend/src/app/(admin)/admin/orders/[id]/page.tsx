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
  qb_invoice_id: string | null;
  subtotal: string;
  shipping_cost: string;
  total: string;
  items: OrderItem[];
  created_at: string;
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
  pending:    { bg: "rgba(217,119,6,.1)",  color: "#D97706" },
  confirmed:  { bg: "rgba(26,92,255,.1)", color: "#1A5CFF" },
  processing: { bg: "rgba(99,102,241,.1)", color: "#6366F1" },
  shipped:    { bg: "rgba(139,92,246,.1)", color: "#8B5CF6" },
  delivered:  { bg: "rgba(5,150,105,.1)",  color: "#059669" },
  cancelled:  { bg: "rgba(232,36,42,.1)",  color: "#E8242A" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: "rgba(0,0,0,.06)", color: "#555" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, textTransform: "capitalize" as const }}>
      {status}
    </span>
  );
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
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
      // Pre-fill courier section if already shipped
      if (o.courier) setSelectedCourier(o.courier);
      if (o.courier_service) setSelectedService(o.courier_service);
      if (o.tracking_number) setTrackingNumber(o.tracking_number);
    });
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true); setMsg(null);
    try {
      await adminService.updateOrder(id, { status, tracking_number: tracking || undefined });
      setMsg({ text: "Order updated successfully.", ok: true });
      setOrder(prev => prev ? { ...prev, status, tracking_number: tracking || null } : prev);
    } catch {
      setMsg({ text: "Failed to update order.", ok: false });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSyncQB() {
    setIsSyncing(true); setMsg(null);
    try {
      await adminService.syncOrderToQb(id);
      setMsg({ text: "QuickBooks sync queued.", ok: true });
    } catch {
      setMsg({ text: "QB sync failed.", ok: false });
    } finally {
      setIsSyncing(false);
    }
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
      } : prev);
      setStatus("shipped");
      setTracking(trackingNumber);
    } catch {
      setMsg({ text: "Failed to mark as shipped.", ok: false });
    } finally {
      setIsShipping(false);
    }
  }

  if (!order) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "320px" }}>
        <div style={{ fontSize: "13px", color: "#aaa" }}>Loading order…</div>
      </div>
    );
  }

  const courierObj = COURIERS.find(c => c.id === selectedCourier);

  return (
    <div style={{ fontFamily: "var(--font-jakarta)", maxWidth: "860px" }}>
      {/* Back + Header */}
      <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#1A5CFF", cursor: "pointer", fontSize: "13px", fontWeight: 700, padding: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
        ← Back to Orders
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", color: "#2A2830", letterSpacing: ".04em", lineHeight: 1 }}>
            {order.order_number}
          </h1>
          <p style={{ fontSize: "13px", color: "#7A7880", marginTop: "4px" }}>
            {order.company_name} · {new Date(order.created_at).toLocaleDateString()} · <StatusBadge status={order.status} />
          </p>
        </div>
        <button onClick={handleSyncQB} disabled={isSyncing}
          style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "6px", padding: "10px 18px", fontSize: "13px", fontWeight: 700, cursor: "pointer", color: "#2A2830", opacity: isSyncing ? .5 : 1 }}>
          {isSyncing ? "Syncing…" : "🔄 Sync to QuickBooks"}
        </button>
      </div>

      {/* Status message */}
      {msg && (
        <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: msg.ok ? "rgba(5,150,105,.1)" : "rgba(232,36,42,.1)", color: msg.ok ? "#059669" : "#E8242A", border: `1px solid ${msg.ok ? "rgba(5,150,105,.2)" : "rgba(232,36,42,.2)"}` }}>
          {msg.text}
        </div>
      )}

      {/* ── SHIPPING & COURIER ── */}
      <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", padding: "24px", marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".05em", color: "#2A2830", marginBottom: "4px" }}>
          SHIPPING & COURIER
        </h3>
        {order.status === "shipped" && order.courier && (
          <div style={{ fontSize: "12px", color: "#059669", fontWeight: 600, marginBottom: "14px" }}>
            ✓ Shipped via {COURIERS.find(c => c.id === order.courier)?.name ?? order.courier} {order.courier_service}
            {order.tracking_number && ` · Tracking: ${order.tracking_number}`}
          </div>
        )}

        {/* Courier grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "8px", marginBottom: "16px" }}>
          {COURIERS.map(courier => (
            <div key={courier.id}
              onClick={() => { setSelectedCourier(courier.id); setSelectedService(""); }}
              style={{
                border: selectedCourier === courier.id ? "2px solid #1A5CFF" : "1.5px solid #E2E0DA",
                borderRadius: "8px", padding: "12px 8px", textAlign: "center", cursor: "pointer",
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
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".08em", color: "#7A7880", marginBottom: "6px", display: "block" }}>
                Service Type
              </label>
              <select value={selectedService} onChange={e => setSelectedService(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E0DA", borderRadius: "6px", fontSize: "14px", fontFamily: "var(--font-jakarta)", background: "#fff", outline: "none" }}>
                <option value="">Select service…</option>
                {courierObj?.services.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".08em", color: "#7A7880", marginBottom: "6px", display: "block" }}>
                Tracking Number
              </label>
              <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number…"
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E0DA", borderRadius: "6px", fontSize: "14px", fontFamily: "var(--font-jakarta)", outline: "none", boxSizing: "border-box" as const }} />
            </div>
          </div>
        )}

        {selectedCourier && selectedService && (
          <button onClick={handleMarkShipped} disabled={isShipping}
            style={{ background: "#059669", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: isShipping ? .6 : 1, transition: "opacity .15s" }}>
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
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".08em", color: "#7A7880", marginBottom: "6px" }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              style={{ padding: "10px 14px", border: "1.5px solid #E2E0DA", borderRadius: "6px", fontSize: "14px", fontFamily: "var(--font-jakarta)", background: "#fff" }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".08em", color: "#7A7880", marginBottom: "6px" }}>Tracking #</label>
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

      {/* ── LINE ITEMS ── */}
      <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E0DA" }}>
          <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".05em", color: "#2A2830" }}>ORDER ITEMS</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#FAFAF8", borderBottom: "1px solid #E2E0DA" }}>
              {["SKU", "Product", "Color / Size", "Qty", "Unit Price", "Total"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: h === "Qty" || h === "Unit Price" || h === "Total" ? "right" : "left", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase" as const, letterSpacing: ".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: i < order.items.length - 1 ? "1px solid #F0EDE8" : "none" }}>
                <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "11px", color: "#7A7880" }}>{item.sku}</td>
                <td style={{ padding: "12px 16px", color: "#2A2830", fontWeight: 600 }}>{item.product_name}</td>
                <td style={{ padding: "12px 16px", color: "#7A7880" }}>
                  {[item.color, item.size].filter(Boolean).join(" / ") || "—"}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "#2A2830" }}>{item.quantity}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "#2A2830" }}>${Number(item.unit_price).toFixed(2)}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "#2A2830" }}>${Number(item.line_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── TOTALS ── */}
      <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", padding: "20px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <div style={{ fontSize: "13px", color: "#7A7880" }}>Subtotal: <strong style={{ color: "#2A2830" }}>${Number(order.subtotal).toFixed(2)}</strong></div>
          <div style={{ fontSize: "13px", color: "#7A7880" }}>Shipping: <strong style={{ color: "#2A2830" }}>${Number(order.shipping_cost).toFixed(2)}</strong></div>
          <div style={{ height: "1px", width: "180px", background: "#E2E0DA", margin: "4px 0" }} />
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#2A2830", letterSpacing: ".03em" }}>
            TOTAL: ${Number(order.total).toFixed(2)}
          </div>
          {order.po_number && <div style={{ fontSize: "12px", color: "#aaa" }}>PO: {order.po_number}</div>}
          {order.qb_invoice_id && <div style={{ fontSize: "12px", color: "#aaa" }}>QB Invoice: {order.qb_invoice_id}</div>}
        </div>
      </div>
    </div>
  );
}
