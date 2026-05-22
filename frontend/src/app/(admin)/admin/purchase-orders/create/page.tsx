"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiClientError } from "@/lib/api-client";

interface Manufacturer { id: string; name: string; }
interface Variant { id: string; sku: string; color: string | null; size: string | null; retail_price: string; }
interface ProductHit { id: string; name: string; variants: Variant[]; }

interface LineItem {
  key: number;
  product_variant_id: string | null;
  label: string;
  new_product_name: string;
  new_product_sku: string;
  new_product_size: string;
  new_product_color: string;
  qty_ordered: number;
  unit_cost_expected: number;
  is_new: boolean;
}

let _key = 0;
function newItem(): LineItem {
  return {
    key: ++_key,
    product_variant_id: null,
    label: "",
    new_product_name: "",
    new_product_sku: "",
    new_product_size: "",
    new_product_color: "",
    qty_ordered: 1,
    unit_cost_expected: 0,
    is_new: false,
  };
}

export default function CreatePOPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [manufacturerId, setManufacturerId] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([newItem()]);
  const [productSearch, setProductSearch] = useState<Record<number, string>>({});
  const [searchResults, setSearchResults] = useState<Record<number, ProductHit[]>>({});
  const [saving, setSaving] = useState(false);
  const [showNewMfr, setShowNewMfr] = useState(false);
  const [newMfrName, setNewMfrName] = useState("");

  useEffect(() => {
    apiClient.get<Manufacturer[]>("/api/v1/admin/purchase-orders/manufacturers")
      .then(d => setManufacturers(Array.isArray(d) ? d : []));
  }, []);

  async function searchProducts(key: number, q: string) {
    setProductSearch(p => ({ ...p, [key]: q }));
    if (q.length < 2) { setSearchResults(p => ({ ...p, [key]: [] })); return; }
    const data = await apiClient.get<ProductHit[] | { items: ProductHit[] }>(
      `/api/v1/admin/products/?search=${encodeURIComponent(q)}&page_size=10`
    );
    const items = Array.isArray(data) ? data : ((data as { items: ProductHit[] }).items || []);
    setSearchResults(p => ({ ...p, [key]: items }));
  }

  function selectVariant(key: number, product: ProductHit, variant: Variant) {
    setLineItems(items => items.map(it => it.key === key ? {
      ...it,
      product_variant_id: variant.id,
      label: `${product.name} — ${variant.color || ""} ${variant.size || ""}`.trim(),
      is_new: false,
    } : it));
    setSearchResults(p => ({ ...p, [key]: [] }));
    setProductSearch(p => ({ ...p, [key]: "" }));
  }

  function updateItem(key: number, field: keyof LineItem, value: string | number | boolean | null) {
    setLineItems(items => items.map(it => it.key === key ? { ...it, [field]: value } : it));
  }

  async function addManufacturer() {
    if (!newMfrName.trim()) return;
    const data = await apiClient.post<Manufacturer>("/api/v1/admin/purchase-orders/manufacturers", { name: newMfrName });
    setManufacturers(m => [...m, data]);
    setManufacturerId(data.id);
    setNewMfrName("");
    setShowNewMfr(false);
  }

  async function save() {
    if (!manufacturerId) { alert("Please select a manufacturer"); return; }
    const validItems = lineItems.filter(it => it.product_variant_id || it.new_product_name);
    if (validItems.length === 0) { alert("Add at least one line item"); return; }
    setSaving(true);
    try {
      const data = await apiClient.post<{ id: string }>("/api/v1/admin/purchase-orders/", {
        manufacturer_id: manufacturerId,
        expected_delivery: expectedDelivery || null,
        notes: notes || null,
        line_items: validItems.map(it => ({
          product_variant_id: it.product_variant_id,
          new_product_name: it.new_product_name || null,
          new_product_sku: it.new_product_sku || null,
          new_product_size: it.new_product_size || null,
          new_product_color: it.new_product_color || null,
          qty_ordered: it.qty_ordered,
          unit_cost_expected: it.unit_cost_expected,
        })),
      });
      router.push(`/admin/purchase-orders/${data.id}`);
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Failed to create PO");
    } finally {
      setSaving(false);
    }
  }

  const total = lineItems.reduce((s, it) => s + it.qty_ordered * it.unit_cost_expected, 0);

  return (
    <div style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: "13px" }}>← Back</button>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1B3A5C", letterSpacing: ".04em" }}>CREATE PURCHASE ORDER</h1>
      </div>

      {/* Step tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "28px" }}>
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setStep(s)} style={{
            padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600,
            background: step === s ? "#1B3A5C" : "#F3F4F6",
            color: step === s ? "#fff" : "#6B7280",
          }}>
            Step {s}: {["PO Info", "Line Items", "Review"][s - 1]}
          </button>
        ))}
      </div>

      {/* Step 1: PO Info */}
      {step === 1 && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "28px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1B3A5C", marginBottom: "20px" }}>PO Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={LBL}>Manufacturer *</label>
              <select value={manufacturerId} onChange={e => {
                if (e.target.value === "__new__") { setShowNewMfr(true); return; }
                setManufacturerId(e.target.value);
              }} style={SELECT}>
                <option value="">Select manufacturer…</option>
                {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                <option value="__new__">+ Add New Manufacturer</option>
              </select>
              {showNewMfr && (
                <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                  <input value={newMfrName} onChange={e => setNewMfrName(e.target.value)} placeholder="Manufacturer name" style={{ ...INPUT, flex: 1 }} />
                  <button onClick={addManufacturer} style={BTN_SM}>Add</button>
                  <button onClick={() => setShowNewMfr(false)} style={{ ...BTN_SM, background: "#F3F4F6", color: "#374151" }}>Cancel</button>
                </div>
              )}
            </div>
            <div>
              <label style={LBL}>Expected Delivery</label>
              <input type="date" value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} style={INPUT} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={LBL}>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ ...INPUT, resize: "vertical" }} placeholder="Optional notes…" />
            </div>
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setStep(2)} style={BTN_PRIMARY}>Next: Add Line Items →</button>
          </div>
        </div>
      )}

      {/* Step 2: Line Items */}
      {step === 2 && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "28px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1B3A5C", marginBottom: "20px" }}>Line Items</h2>

          {lineItems.map((item, idx) => (
            <div key={item.key} style={{ border: "1px solid #E5E7EB", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Item {idx + 1}</span>
                <button onClick={() => setLineItems(l => l.filter(it => it.key !== item.key))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: "18px", lineHeight: 1 }}>×</button>
              </div>

              {/* Toggle: existing / new product */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <button onClick={() => updateItem(item.key, "is_new", false)} style={{
                  padding: "5px 14px", borderRadius: "6px", border: "1px solid", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  background: !item.is_new ? "#1B3A5C" : "#fff", color: !item.is_new ? "#fff" : "#6B7280",
                  borderColor: !item.is_new ? "#1B3A5C" : "#D1D5DB",
                }}>Search Existing</button>
                <button onClick={() => updateItem(item.key, "is_new", true)} style={{
                  padding: "5px 14px", borderRadius: "6px", border: "1px solid", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  background: item.is_new ? "#1B3A5C" : "#fff", color: item.is_new ? "#fff" : "#6B7280",
                  borderColor: item.is_new ? "#1B3A5C" : "#D1D5DB",
                }}>New Product</button>
              </div>

              {!item.is_new ? (
                <div style={{ position: "relative", marginBottom: "12px" }}>
                  {item.product_variant_id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", color: "#374151", flex: 1 }}>{item.label}</span>
                      <button onClick={() => updateItem(item.key, "product_variant_id", null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: "12px" }}>Change</button>
                    </div>
                  ) : (
                    <>
                      <input
                        value={productSearch[item.key] || ""}
                        onChange={e => searchProducts(item.key, e.target.value)}
                        placeholder="Search by product name or SKU…"
                        style={INPUT}
                      />
                      {(searchResults[item.key] || []).length > 0 && (
                        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", zIndex: 10, maxHeight: "240px", overflowY: "auto", boxShadow: "0 4px 16px rgba(0,0,0,.1)" }}>
                          {(searchResults[item.key] ?? []).map(product =>
                            product.variants.map(v => (
                              <button key={v.id} onClick={() => selectVariant(item.key, product, v)}
                                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", borderBottom: "1px solid #F3F4F6" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F9FAFB"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                              >
                                <strong>{product.name}</strong> — {v.color} / {v.size} <span style={{ color: "#9CA3AF" }}>({v.sku})</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  <input value={item.new_product_name} onChange={e => updateItem(item.key, "new_product_name", e.target.value)} placeholder="Product Name *" style={INPUT} />
                  <input value={item.new_product_sku} onChange={e => updateItem(item.key, "new_product_sku", e.target.value)} placeholder="SKU" style={INPUT} />
                  <input value={item.new_product_color} onChange={e => updateItem(item.key, "new_product_color", e.target.value)} placeholder="Color" style={INPUT} />
                  <input value={item.new_product_size} onChange={e => updateItem(item.key, "new_product_size", e.target.value)} placeholder="Size" style={INPUT} />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "120px 160px auto", gap: "8px", alignItems: "center" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#6B7280", display: "block", marginBottom: "4px" }}>QTY ORDERED</label>
                  <input type="number" min={1} value={item.qty_ordered}
                    onChange={e => updateItem(item.key, "qty_ordered", parseInt(e.target.value) || 1)}
                    style={INPUT} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#6B7280", display: "block", marginBottom: "4px" }}>UNIT COST ($)</label>
                  <input type="number" min={0} step={0.01} value={item.unit_cost_expected}
                    onChange={e => updateItem(item.key, "unit_cost_expected", parseFloat(e.target.value) || 0)}
                    style={INPUT} />
                </div>
                <div style={{ paddingTop: "16px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                  = ${(item.qty_ordered * item.unit_cost_expected).toFixed(2)}
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => setLineItems(l => [...l, newItem()])} style={{ ...BTN_SM, width: "100%", marginTop: "4px" }}>
            + Add Line Item
          </button>

          <div style={{ marginTop: "20px", padding: "16px", background: "#F9FAFB", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#6B7280" }}>Running Total:</span>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#1B3A5C" }}>${total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={{ ...BTN_SM, background: "#F3F4F6", color: "#374151" }}>← Back</button>
            <button onClick={() => setStep(3)} style={BTN_PRIMARY}>Next: Review →</button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "28px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1B3A5C", marginBottom: "20px" }}>Review & Save</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px" }}>MANUFACTURER</div>
              <div style={{ fontWeight: 600 }}>{manufacturers.find(m => m.id === manufacturerId)?.name || "—"}</div>
            </div>
            <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px" }}>EXPECTED DELIVERY</div>
              <div style={{ fontWeight: 600 }}>{expectedDelivery || "—"}</div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                {["PRODUCT", "QTY", "UNIT COST", "TOTAL"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#6B7280", letterSpacing: ".07em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineItems.filter(it => it.product_variant_id || it.new_product_name).map(it => (
                <tr key={it.key} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "12px 14px", fontSize: "13px" }}>{it.label || it.new_product_name}</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px" }}>{it.qty_ordered}</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px" }}>${it.unit_cost_expected.toFixed(2)}</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", fontWeight: 600 }}>${(it.qty_ordered * it.unit_cost_expected).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", fontSize: "18px", fontWeight: 700, color: "#1B3A5C", marginBottom: "24px" }}>
            Total Expected: ${total.toFixed(2)}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <button onClick={() => setStep(2)} style={{ ...BTN_SM, background: "#F3F4F6", color: "#374151" }}>← Back</button>
            <button onClick={save} disabled={saving} style={BTN_PRIMARY}>
              {saving ? "Saving…" : "Save as Draft"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const LBL: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" };
const INPUT: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: "7px", fontSize: "13px", boxSizing: "border-box", outline: "none" };
const SELECT: React.CSSProperties = { ...INPUT, background: "#fff" };
const BTN_PRIMARY: React.CSSProperties = { padding: "10px 24px", background: "#1B3A5C", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" };
const BTN_SM: React.CSSProperties = { padding: "8px 16px", background: "#1B3A5C", color: "#fff", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 600, cursor: "pointer" };
