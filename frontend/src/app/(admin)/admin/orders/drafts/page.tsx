"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { adminService } from "@/services/admin.service";
import { FileTextIcon } from "@/components/ui/icons";

interface DraftOrder {
  id: string;
  order_number: string;
  company_name: string;
  status: string;
  payment_status: string;
  po_number: string | null;
  total: string;
  item_count: number;
  created_at: string;
}

interface CompanyOption { id: string; name: string; }

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:   { bg: "rgba(217,119,6,.1)",  color: "#D97706" },
  confirmed: { bg: "rgba(26,92,255,.1)",  color: "#1A5CFF" },
  cancelled: { bg: "rgba(232,36,42,.1)",  color: "#E8242A" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: "rgba(0,0,0,.06)", color: "#555" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, textTransform: "capitalize" as const }}>
      {status}
    </span>
  );
}

// ── Create Draft Modal ─────────────────────────────────────────────────────────

function CreateDraftModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (id: string) => void }) {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService.listCompanies({ q: companySearch || undefined, page_size: 50 })
      .then((d: unknown) => {
        const data = d as { items: CompanyOption[] };
        setCompanies(data.items ?? []);
      })
      .catch(() => {});
  }, [companySearch]);

  async function handleCreate() {
    if (!companyId) { setError("Please select a company."); return; }
    setSaving(true); setError(null);
    try {
      const result = await apiClient.post<{ id: string; order_number: string }>("/api/v1/admin/orders/draft", {
        company_id: companyId,
        po_number: poNumber || undefined,
        notes: notes || undefined,
      });
      onSuccess(result.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create draft order");
    } finally {
      setSaving(false);
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "9px 12px", border: "1.5px solid #E2E0DA",
    borderRadius: "7px", fontSize: "13px", outline: "none", boxSizing: "border-box",
    fontFamily: "var(--font-jakarta)",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.5)", padding: "16px" }}>
      <div style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #E2E0DA" }}>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#2A2830", letterSpacing: ".04em", margin: 0 }}>CREATE DRAFT ORDER</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: "#7A7880", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {error && <div style={{ background: "rgba(232,36,42,.08)", border: "1px solid rgba(232,36,42,.2)", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#E8242A", marginBottom: "16px" }}>{error}</div>}

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#7A7880", marginBottom: "5px" }}>
              Company *
            </label>
            <input
              style={inp}
              placeholder="Search company…"
              value={companySearch}
              onChange={e => setCompanySearch(e.target.value)}
            />
            {companies.length > 0 && (
              <div style={{ border: "1.5px solid #E2E0DA", borderTop: "none", borderRadius: "0 0 7px 7px", maxHeight: "160px", overflowY: "auto", background: "#fff" }}>
                {companies.map(c => (
                  <div
                    key={c.id}
                    onClick={() => { setCompanyId(c.id); setCompanySearch(c.name); setCompanies([]); }}
                    style={{ padding: "9px 12px", fontSize: "13px", cursor: "pointer", background: companyId === c.id ? "rgba(26,92,255,.07)" : "#fff", color: companyId === c.id ? "#1A5CFF" : "#2A2830", fontWeight: companyId === c.id ? 700 : 400 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#F4F3EF")}
                    onMouseLeave={e => (e.currentTarget.style.background = companyId === c.id ? "rgba(26,92,255,.07)" : "#fff")}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#7A7880", marginBottom: "5px" }}>
              PO Number (optional)
            </label>
            <input style={inp} value={poNumber} onChange={e => setPoNumber(e.target.value)} placeholder="Customer purchase order #" />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#7A7880", marginBottom: "5px" }}>
              Notes (optional)
            </label>
            <textarea style={{ ...inp, resize: "vertical", minHeight: "64px" }} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <p style={{ fontSize: "12px", color: "#7A7880", marginBottom: "16px" }}>
            A draft order is created with status "pending" and $0 total. You can add items and update pricing from the order detail page.
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "10px", border: "1.5px solid #E2E0DA", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: "#fff" }}>
              Cancel
            </button>
            <button
              onClick={handleCreate} disabled={saving || !companyId}
              style={{ flex: 2, padding: "10px", background: (saving || !companyId) ? "#E2E0DA" : "#1A5CFF", color: (saving || !companyId) ? "#aaa" : "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 700, cursor: (saving || !companyId) ? "not-allowed" : "pointer" }}>
              {saving ? "Creating…" : "Create Draft Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DraftOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<DraftOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const data = await apiClient.get<{ items: DraftOrder[]; total: number }>(
        "/api/v1/admin/orders?status=pending&page_size=100"
      );
      setOrders(data?.items ?? []);
      setTotal(data?.total ?? 0);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleConvert(orderId: string) {
    try {
      await apiClient.patch(`/api/v1/admin/orders/${orderId}`, { status: "confirmed" });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "confirmed" } : o));
    } catch { /* ignore */ }
  }

  return (
    <div style={{ fontFamily: "var(--font-jakarta)" }}>
      {showCreate && (
        <CreateDraftModal
          onClose={() => setShowCreate(false)}
          onSuccess={(id) => {
            setShowCreate(false);
            router.push(`/admin/orders/${id}`);
          }}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "32px", color: "#2A2830", letterSpacing: ".02em", lineHeight: 1 }}>DRAFT ORDERS</h1>
          <p style={{ fontSize: "13px", color: "#7A7880", marginTop: "4px" }}>Pending orders awaiting confirmation · {total} total</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{ background: "#1A5CFF", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
          + Create Draft
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#FAFAF8", borderBottom: "2px solid #E2E0DA" }}>
              {["Order #", "Company", "Status", "PO #", "Items", "Total", "Created", "Actions"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: h === "Total" ? "right" as const : "left" as const, fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase" as const, letterSpacing: ".06em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && orders.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#bbb", fontSize: "14px" }}>Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "56px", textAlign: "center" as const }}>
                  <div style={{ marginBottom: "10px" }}><FileTextIcon size={32} color="#aaa" /></div>
                  <div style={{ fontSize: "14px", color: "#aaa", fontWeight: 600 }}>No draft orders</div>
                  <div style={{ fontSize: "12px", color: "#bbb", marginTop: "4px" }}>Pending orders will appear here</div>
                </td>
              </tr>
            ) : orders.map((o, i) => (
              <tr key={o.id}
                style={{ borderBottom: i < orders.length - 1 ? "1px solid #F0EDE8" : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FAFAF8")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "13px 16px" }}>
                  <Link href={`/admin/orders/${o.id}`} style={{ color: "#1A5CFF", textDecoration: "none", fontFamily: "monospace", fontSize: "12px", fontWeight: 700 }}>
                    {o.order_number}
                  </Link>
                </td>
                <td style={{ padding: "13px 16px", color: "#2A2830", fontWeight: 600 }}>{o.company_name}</td>
                <td style={{ padding: "13px 16px" }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: "13px 16px", color: "#7A7880" }}>{o.po_number ?? "—"}</td>
                <td style={{ padding: "13px 16px", color: "#2A2830" }}>{o.item_count}</td>
                <td style={{ padding: "13px 16px", textAlign: "right" as const, fontWeight: 700, color: "#2A2830" }}>${Number(o.total).toFixed(2)}</td>
                <td style={{ padding: "13px 16px", color: "#7A7880" }}>{new Date(o.created_at).toLocaleDateString()}</td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
                    {o.status === "pending" && (
                      <button onClick={() => handleConvert(o.id)}
                        style={{ background: "rgba(5,150,105,.1)", color: "#059669", border: "none", padding: "5px 12px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" as const }}>
                        ✓ Confirm
                      </button>
                    )}
                    <Link href={`/admin/orders/${o.id}`}
                      style={{ background: "#F4F3EF", color: "#2A2830", border: "1px solid #E2E0DA", padding: "5px 12px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, textDecoration: "none" }}>
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
