"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { apiClient } from "@/lib/api-client";
import { TagIcon, TrashIcon } from "@/components/ui/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VolumeBreak { min_qty: number; discount: number; }

interface PricingTier {
  id: string;
  name: string;
  description: string | null;
  discount_percent: number;
  discount_percentage: number;
  moq: number;
  tax_exempt: boolean;
  tax_percentage: number;
  payment_terms: string;
  credit_limit: number;
  priority_support: boolean;
  volume_breaks: VolumeBreak[];
  customer_count: number;
  is_active: boolean;
}

interface ShippingBracket { min_order: number; rate: number; }

interface DiscountGroup {
  id: string;
  title: string;
  customer_tag: string;
  applies_to: "store" | "collections" | "products";
  applies_to_ids: string[];
  min_req_type: "none" | "amount" | "quantity";
  min_req_value: number;
  shipping_type: "store_default" | "flat_rate";
  shipping_amount: number;
  shipping_brackets: ShippingBracket[];
  status: "enabled" | "disabled";
  created_at: string;
}

interface VPProduct {
  id: string;
  name: string;
  categories: string[];
}

interface TierOverride {
  price: string;
  discount: string;
}

interface BrowseItem { id: string; name: string; }

const EMPTY_TIER_FORM = {
  name: "",
  description: "",
  discount_percent: 0,
  moq: 0,
  tax_exempt: false,
  tax_percentage: 0,
  payment_terms: "immediate",
  credit_limit: 0,
  priority_support: false,
  volume_breaks: [] as VolumeBreak[],
};

const EMPTY_GROUP_FORM: Omit<DiscountGroup, "id" | "created_at" | "applies_to_ids" | "shipping_brackets"> = {
  title: "",
  customer_tag: "",
  applies_to: "store",
  min_req_type: "none",
  min_req_value: 0,
  shipping_type: "store_default",
  shipping_amount: 0,
  status: "enabled",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
  letterSpacing: ".08em", color: "#7A7880", display: "block", marginBottom: "5px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1.5px solid #E2E0DA",
  borderRadius: "7px", fontSize: "14px", fontFamily: "var(--font-jakarta)",
  outline: "none", boxSizing: "border-box", background: "#fff",
};

const sectionBox: React.CSSProperties = {
  background: "#F4F3EF", borderRadius: "8px", padding: "18px", marginBottom: "16px",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingTiersPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"tiers" | "groups" | "variants">(
    initialTab === "groups" ? "groups" : initialTab === "variants" ? "variants" : "tiers"
  );

  // ── Tiers state ───────────────────────────────────────────────────────────
  const [tiers, setTiers]           = useState<PricingTier[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState({ ...EMPTY_TIER_FORM });
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);

  // ── Discount Groups state ─────────────────────────────────────────────────
  const [groups, setGroups]               = useState<DiscountGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupForm, setGroupForm]           = useState({ ...EMPTY_GROUP_FORM });
  const [savingGroup, setSavingGroup]       = useState(false);
  const [groupSearch, setGroupSearch]       = useState("");

  // ── Browse state (for Applies To collections/products picker) ─────────────
  const [browseIds, setBrowseIds]       = useState<string[]>([]);
  const [browseSearch, setBrowseSearch] = useState("");
  const [browseList, setBrowseList]     = useState<BrowseItem[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);

  // ── Flat rate brackets state ──────────────────────────────────────────────
  const [flatBrackets, setFlatBrackets] = useState<ShippingBracket[]>([{ min_order: 0, rate: 0 }]);

  // ── Individual Variant Pricing state ──────────────────────────────────────
  const [vpProducts, setVpProducts]   = useState<VPProduct[]>([]);
  const [vpLoading, setVpLoading]     = useState(false);
  const [vpOverrides, setVpOverrides] = useState<Record<string, Record<string, TierOverride>>>({}); // productId → groupId → {price, discount}
  const [vpSaving, setVpSaving]       = useState(false);
  const [vpSearch, setVpSearch]       = useState("");

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    try {
      const data = await adminService.listPricingTiers() as PricingTier[];
      setTiers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  async function loadGroups() {
    setGroupsLoading(true);
    try {
      const data = await apiClient.get<DiscountGroup[]>("/api/v1/admin/discount-groups").catch(() => []);
      setGroups(Array.isArray(data) ? data : []);
    } finally {
      setGroupsLoading(false);
    }
  }

  async function loadVariantPricing() {
    setVpLoading(true);
    try {
      // Products endpoint returns list[ProductDetail] directly (not paginated)
      const prods = await apiClient.get<Array<{ id: string; name: string; categories: Array<{ id: string; name: string }> }>>("/api/v1/admin/products?page_size=200").catch(() => []);
      setVpProducts(
        (Array.isArray(prods) ? prods : []).map(p => ({
          id: String(p.id),
          name: p.name,
          categories: (p.categories || []).map(c => c.name),
        }))
      );
      const overrides = await apiClient.get<Record<string, Record<string, TierOverride>>>("/api/v1/admin/variant-pricing").catch(() => ({}));
      setVpOverrides(overrides ?? {});
    } finally {
      setVpLoading(false);
    }
  }

  async function loadBrowseList(type: "collections" | "products") {
    setBrowseLoading(true);
    setBrowseList([]);
    try {
      if (type === "collections") {
        const cats = await apiClient.get<Array<{ id: string; name: string; children?: Array<{ id: string; name: string }> }>>("/api/v1/products/categories").catch(() => []);
        const flat: BrowseItem[] = [];
        function flatten(arr: Array<{ id: string; name: string; children?: Array<{ id: string; name: string }> }>, prefix = "") {
          for (const c of arr) {
            flat.push({ id: String(c.id), name: prefix ? `${prefix} ${c.name}` : c.name });
            if (c.children?.length) flatten(c.children, "↳");
          }
        }
        flatten(Array.isArray(cats) ? cats : []);
        setBrowseList(flat);
      } else {
        const prods = await apiClient.get<Array<{ id: string; name: string }>>("/api/v1/admin/products?page_size=200").catch(() => []);
        setBrowseList((Array.isArray(prods) ? prods : []).map(p => ({ id: String(p.id), name: p.name })));
      }
    } finally {
      setBrowseLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (activeTab === "groups" && groups.length === 0) loadGroups();
    if (activeTab === "variants") {
      if (vpProducts.length === 0) loadVariantPricing();
      if (groups.length === 0) loadGroups();
    }
  }, [activeTab]); // eslint-disable-line

  // ── Tier Stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalCustomers = tiers.reduce((s, t) => s + (t.customer_count || 0), 0);
    const avgDiscount = tiers.length
      ? tiers.reduce((s, t) => s + (t.discount_percentage ?? t.discount_percent ?? 0), 0) / tiers.length
      : 0;
    const popular = tiers.length
      ? tiers.reduce((a, b) => (a.customer_count || 0) >= (b.customer_count || 0) ? a : b)
      : null;
    return { totalCustomers, avgDiscount, popular };
  }, [tiers]);

  // ── Tier modal helpers ────────────────────────────────────────────────────
  function openCreate() { setEditingId(null); setForm({ ...EMPTY_TIER_FORM }); setShowModal(true); }

  function openEdit(tier: PricingTier) {
    setEditingId(tier.id);
    setForm({
      name: tier.name,
      description: tier.description ?? "",
      discount_percent: tier.discount_percent ?? tier.discount_percentage ?? 0,
      moq: tier.moq ?? 0,
      tax_exempt: tier.tax_exempt ?? false,
      tax_percentage: tier.tax_percentage ?? 0,
      payment_terms: tier.payment_terms ?? "immediate",
      credit_limit: tier.credit_limit ?? 0,
      priority_support: tier.priority_support ?? false,
      volume_breaks: (tier.volume_breaks ?? []).map(vb => ({ ...vb })),
    });
    setShowModal(true);
  }

  function closeModal() { setShowModal(false); setEditingId(null); }

  async function handleSave() {
    if (!form.name.trim()) { showToast("Tier name is required", false); return; }
    setSaving(true);
    try {
      if (editingId) { await adminService.updatePricingTier(editingId, form); showToast("Tier updated"); }
      else { await adminService.createPricingTier(form); showToast("Tier created"); }
      closeModal();
      await load();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete tier "${name}"? Customers will lose their pricing.`)) return;
    try {
      await adminService.deletePricingTier(id);
      showToast("Tier deleted");
      await load();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", false);
    }
  }

  function setVB(i: number, field: "min_qty" | "discount", val: number) {
    const vbs = [...form.volume_breaks];
    vbs[i] = { ...vbs[i]!, [field]: val };
    setForm(f => ({ ...f, volume_breaks: vbs }));
  }

  // ── Discount Group helpers ────────────────────────────────────────────────
  function openCreateGroup() {
    setEditingGroupId(null);
    setGroupForm({ ...EMPTY_GROUP_FORM });
    setBrowseIds([]);
    setBrowseSearch("");
    setBrowseList([]);
    setFlatBrackets([{ min_order: 0, rate: 0 }]);
    setShowGroupModal(true);
  }

  function openEditGroup(g: DiscountGroup) {
    setEditingGroupId(g.id);
    setGroupForm({
      title: g.title,
      customer_tag: g.customer_tag,
      applies_to: g.applies_to,
      min_req_type: g.min_req_type,
      min_req_value: g.min_req_value,
      shipping_type: g.shipping_type,
      shipping_amount: g.shipping_amount,
      status: g.status,
    });
    setBrowseIds(g.applies_to_ids || []);
    setBrowseSearch("");
    setFlatBrackets(g.shipping_brackets && g.shipping_brackets.length > 0 ? g.shipping_brackets : [{ min_order: 0, rate: 0 }]);
    if (g.applies_to !== "store") loadBrowseList(g.applies_to);
    else setBrowseList([]);
    setShowGroupModal(true);
  }

  async function handleSaveGroup() {
    if (!groupForm.title.trim()) { showToast("Title is required", false); return; }
    setSavingGroup(true);
    try {
      const payload = {
        ...groupForm,
        applies_to_ids: groupForm.applies_to === "store" ? [] : browseIds,
        shipping_brackets: groupForm.shipping_type === "flat_rate" ? flatBrackets : [],
      };
      if (editingGroupId) {
        await apiClient.patch(`/api/v1/admin/discount-groups/${editingGroupId}`, payload);
        showToast("Group updated");
      } else {
        await apiClient.post("/api/v1/admin/discount-groups", payload);
        showToast("Group created");
      }
      setShowGroupModal(false);
      await loadGroups();
    } catch {
      showToast("Save failed", false);
    } finally { setSavingGroup(false); }
  }

  async function handleDeleteGroup(id: string, title: string) {
    if (!confirm(`Delete discount group "${title}"?`)) return;
    try {
      await apiClient.delete(`/api/v1/admin/discount-groups/${id}`);
      showToast("Group deleted");
      await loadGroups();
    } catch { showToast("Delete failed", false); }
  }

  function handleAppliesTo(opt: "store" | "collections" | "products") {
    setGroupForm(f => ({ ...f, applies_to: opt }));
    setBrowseIds([]);
    setBrowseSearch("");
    if (opt !== "store") loadBrowseList(opt);
    else setBrowseList([]);
  }

  function updateBracket(i: number, field: "min_order" | "rate", val: number) {
    setFlatBrackets(prev => {
      const updated = [...prev];
      updated[i] = { ...updated[i]!, [field]: val };
      return updated;
    });
  }

  // ── Variant Pricing helpers ───────────────────────────────────────────────
  function updateVPOverride(productId: string, groupId: string, field: "price" | "discount", value: string) {
    setVpOverrides(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] ?? {}),
        [groupId]: {
          ...(prev[productId]?.[groupId] ?? { price: "", discount: "" }),
          [field]: value,
        },
      },
    }));
  }

  async function handleSaveVariantPricing() {
    setVpSaving(true);
    try {
      await apiClient.post("/api/v1/admin/variant-pricing", { overrides: vpOverrides });
      showToast("Pricing saved");
    } catch { showToast("Save failed", false); }
    finally { setVpSaving(false); }
  }

  const filteredGroups = groups.filter(g => !groupSearch || g.title.toLowerCase().includes(groupSearch.toLowerCase()));
  const filteredVpProducts = vpProducts.filter(p =>
    !vpSearch || p.name.toLowerCase().includes(vpSearch.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "var(--font-jakarta)" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, background: toast.ok ? "#059669" : "#E8242A", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "32px", color: "#2A2830", letterSpacing: ".02em", lineHeight: 1 }}>Customer Pricing</h1>
          <p style={{ fontSize: "13px", color: "#7A7880", marginTop: "4px" }}>Manage tiers, discount groups, and individual variant pricing</p>
        </div>
        {activeTab === "tiers" && (
          <button onClick={openCreate} style={{ padding: "10px 20px", background: "#1A5CFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            + New Tier
          </button>
        )}
        {activeTab === "groups" && (
          <button onClick={openCreateGroup} style={{ padding: "10px 20px", background: "#1A5CFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            + Create Group
          </button>
        )}
        {activeTab === "variants" && (
          <button onClick={handleSaveVariantPricing} disabled={vpSaving} style={{ padding: "10px 20px", background: "#059669", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", opacity: vpSaving ? 0.6 : 1 }}>
            {vpSaving ? "Saving…" : "Save Pricing"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #E2E0DA", marginBottom: "24px" }}>
        {([
          { key: "tiers", label: "Customer Tiers" },
          { key: "groups", label: "Discount Groups" },
          { key: "variants", label: "Individual Variant Pricing" },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? "#1A5CFF" : "#7A7880",
              borderBottom: activeTab === tab.key ? "2px solid #1A5CFF" : "2px solid transparent",
              marginBottom: "-2px", whiteSpace: "nowrap",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Customer Tiers ── */}
      {activeTab === "tiers" && (
        <>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Total Tiers",     value: tiers.length.toString(),              color: "#2A2830" },
              { label: "Total Customers", value: stats.totalCustomers.toString(),       color: "#1A5CFF" },
              { label: "Avg Discount",    value: `${stats.avgDiscount.toFixed(1)}%`,    color: "#D97706" },
              { label: "Most Popular",    value: stats.popular ? stats.popular.name : "—", color: "#059669" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#7A7880", marginBottom: "6px" }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", color: s.color, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#bbb", fontSize: "14px" }}>Loading…</div>
          ) : tiers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px" }}>
              <div style={{ marginBottom: "12px" }}><TagIcon size={32} color="#2A2830" /></div>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#2A2830", marginBottom: "6px" }}>No Customer Tiers</div>
              <div style={{ fontSize: "13px", color: "#7A7880", marginBottom: "20px" }}>Create your first tier to start segmenting wholesale customers</div>
              <button onClick={openCreate} style={{ padding: "10px 20px", background: "#1A5CFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                + Create First Tier
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "16px" }}>
              {tiers.map(tier => {
                const disc = tier.discount_percentage ?? tier.discount_percent ?? 0;
                return (
                  <div key={tier.id} style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#2A2830", lineHeight: 1 }}>{tier.name}</div>
                        <div style={{ fontSize: "12px", color: "#7A7880", marginTop: "2px" }}>{tier.customer_count || 0} customer{tier.customer_count !== 1 ? "s" : ""}</div>
                        {tier.description && <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>{tier.description}</div>}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => openEdit(tier)} style={{ padding: "6px 12px", border: "1px solid #E2E0DA", borderRadius: "6px", background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#2A2830" }}>Edit</button>
                        <button onClick={() => handleDelete(tier.id, tier.name)} style={{ padding: "6px 12px", border: "1px solid rgba(232,36,42,.25)", borderRadius: "6px", background: "rgba(232,36,42,.05)", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#E8242A" }}>Delete</button>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div style={{ background: "#F4F3EF", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>Discount</div>
                        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", color: "#1A5CFF" }}>{disc}%</div>
                      </div>
                      <div style={{ background: "#F4F3EF", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>MOQ</div>
                        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", color: "#2A2830" }}>{tier.moq || 0} units</div>
                      </div>
                      <div style={{ background: "#F4F3EF", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#aaa", marginBottom: "4px" }}>Payment Terms</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#2A2830", textTransform: "uppercase" }}>{tier.payment_terms || "Standard"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
                      {tier.tax_exempt && <span style={{ padding: "2px 8px", background: "rgba(5,150,105,.1)", color: "#059669", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>Tax Exempt</span>}
                      {tier.priority_support && <span style={{ padding: "2px 8px", background: "rgba(124,58,237,.1)", color: "#7C3AED", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>Priority Support</span>}
                      {tier.credit_limit > 0 && <span style={{ padding: "2px 8px", background: "rgba(8,145,178,.1)", color: "#0891B2", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>${tier.credit_limit.toLocaleString()} credit</span>}
                    </div>
                    {(tier.volume_breaks?.length ?? 0) > 0 && (
                      <div style={{ marginTop: "14px", borderTop: "1px solid #E2E0DA", paddingTop: "14px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#aaa", marginBottom: "8px" }}>Volume Breaks</div>
                        {tier.volume_breaks!.map((vb, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0", borderBottom: "1px solid #F4F3EF" }}>
                            <span style={{ color: "#7A7880" }}>{vb.min_qty}+ units</span>
                            <span style={{ fontWeight: 700, color: "#059669" }}>{vb.discount}% off</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── TAB: Discount Groups ── */}
      {activeTab === "groups" && (
        <div>
          {/* Search */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <input
              value={groupSearch}
              onChange={e => setGroupSearch(e.target.value)}
              placeholder="Search groups…"
              style={{ ...inputStyle, maxWidth: "320px" }}
            />
          </div>

          {groupsLoading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#bbb", fontSize: "14px" }}>Loading…</div>
          ) : groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px" }}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#2A2830", marginBottom: "6px" }}>No Discount Groups</div>
              <div style={{ fontSize: "13px", color: "#7A7880", marginBottom: "20px" }}>Create a group to apply discounts and shipping rules to tagged customers</div>
              <button onClick={openCreateGroup} style={{ padding: "10px 20px", background: "#1A5CFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                + Create First Group
              </button>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#FAFAF8", borderBottom: "2px solid #E2E0DA" }}>
                    {["Title", "Customer Tag", "Applies To", "Min Requirement", "Shipping", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.map((g, i) => (
                    <tr key={g.id} style={{ borderBottom: i < filteredGroups.length - 1 ? "1px solid #F0EDE8" : "none" }}>
                      <td style={{ padding: "13px 16px", fontWeight: 700, color: "#2A2830" }}>{g.title}</td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ background: "#F4F3EF", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{g.customer_tag || "—"}</span>
                      </td>
                      <td style={{ padding: "13px 16px", color: "#7A7880", textTransform: "capitalize" }}>
                        {g.applies_to.replace("_", " ")}
                        {g.applies_to_ids?.length > 0 && (
                          <span style={{ marginLeft: "4px", fontSize: "11px", color: "#1A5CFF" }}>({g.applies_to_ids.length})</span>
                        )}
                      </td>
                      <td style={{ padding: "13px 16px", color: "#7A7880" }}>
                        {g.min_req_type === "none" ? "None" : g.min_req_type === "amount" ? `$${g.min_req_value}` : `${g.min_req_value} units`}
                      </td>
                      <td style={{ padding: "13px 16px", color: "#7A7880" }}>
                        {g.shipping_type === "flat_rate"
                          ? g.shipping_brackets?.length > 0
                            ? `${g.shipping_brackets.length} bracket${g.shipping_brackets.length !== 1 ? "s" : ""}`
                            : "Flat rate"
                          : "Store default"}
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ background: g.status === "enabled" ? "rgba(5,150,105,.1)" : "rgba(0,0,0,.06)", color: g.status === "enabled" ? "#059669" : "#7A7880", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, textTransform: "capitalize" }}>
                          {g.status}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => openEditGroup(g)} style={{ background: "#F4F3EF", border: "1px solid #E2E0DA", padding: "5px 10px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer", color: "#2A2830" }}>Edit</button>
                          <button onClick={() => handleDeleteGroup(g.id, g.title)} style={{ background: "rgba(232,36,42,.06)", border: "1px solid rgba(232,36,42,.2)", padding: "5px 10px", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer", color: "#E8242A" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Individual Variant Pricing ── */}
      {activeTab === "variants" && (
        <div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
            <input
              value={vpSearch}
              onChange={e => setVpSearch(e.target.value)}
              placeholder="Search products…"
              style={{ ...inputStyle, maxWidth: "320px" }}
            />
            <span style={{ fontSize: "12px", color: "#7A7880" }}>Set per-group prices or discounts; leave blank to use group's default</span>
          </div>

          {vpLoading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#bbb", fontSize: "14px" }}>Loading…</div>
          ) : groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px" }}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", color: "#2A2830", marginBottom: "6px" }}>No Discount Groups</div>
              <div style={{ fontSize: "13px", color: "#7A7880" }}>Create discount groups first to set per-group variant pricing</div>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "10px", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: "#FAFAF8", borderBottom: "2px solid #E2E0DA" }}>
                    <th style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".06em", minWidth: "200px" }}>Product</th>
                    <th style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".06em" }}>Categories</th>
                    {groups.map(group => (
                      <th key={group.id} style={{ padding: "11px 12px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#1A5CFF", textTransform: "uppercase", letterSpacing: ".06em", minWidth: "130px", borderLeft: "1px solid #E2E0DA" }}>
                        {group.title}
                        <div style={{ fontSize: "10px", color: "#7A7880", fontWeight: 500, marginTop: "1px", textTransform: "none" }}>
                          {group.customer_tag ? `@${group.customer_tag}` : group.applies_to}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredVpProducts.length === 0 ? (
                    <tr><td colSpan={2 + groups.length} style={{ padding: "40px", textAlign: "center", color: "#bbb" }}>
                      {vpProducts.length === 0 ? "No products found — make sure products are published" : "No products match your search"}
                    </td></tr>
                  ) : filteredVpProducts.map((product, i) => (
                    <tr key={product.id} style={{ borderBottom: i < filteredVpProducts.length - 1 ? "1px solid #F0EDE8" : "none" }}>
                      <td style={{ padding: "10px 16px", fontWeight: 600, color: "#2A2830" }}>{product.name}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {(product.categories ?? []).slice(0, 3).map(cat => (
                            <span key={cat} style={{ background: "#F4F3EF", padding: "1px 6px", borderRadius: "10px", fontSize: "10px", color: "#7A7880" }}>{cat}</span>
                          ))}
                        </div>
                      </td>
                      {groups.map(group => {
                        const ov = vpOverrides[product.id]?.[group.id] ?? { price: "", discount: "" };
                        return (
                          <td key={group.id} style={{ padding: "8px 12px", borderLeft: "1px solid #E2E0DA" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                <span style={{ fontSize: "11px", color: "#aaa" }}>$</span>
                                <input
                                  type="number"
                                  value={ov.price}
                                  onChange={e => updateVPOverride(product.id, group.id, "price", e.target.value)}
                                  placeholder="Price"
                                  style={{ width: "72px", padding: "4px 6px", border: "1px solid #E2E0DA", borderRadius: "5px", fontSize: "12px", textAlign: "center" }}
                                />
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                <input
                                  type="number"
                                  value={ov.discount}
                                  onChange={e => updateVPOverride(product.id, group.id, "discount", e.target.value)}
                                  placeholder="%"
                                  style={{ width: "72px", padding: "4px 6px", border: "1px solid #E2E0DA", borderRadius: "5px", fontSize: "12px", textAlign: "center" }}
                                />
                                <span style={{ fontSize: "11px", color: "#aaa" }}>%</span>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TIER CREATE/EDIT MODAL ─────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "720px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", color: "#2A2830" }}>
                {editingId ? "EDIT TIER" : "CREATE PRICING TIER"}
              </h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#7A7880", lineHeight: 1 }}>✕</button>
            </div>

            <div style={sectionBox}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".1em", color: "#7A7880", marginBottom: "14px" }}>BASIC INFO</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Tier Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Silver, Gold, Platinum" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Base Discount %</label>
                  <input type="number" min="0" max="100" value={form.discount_percent} onChange={e => setForm(f => ({ ...f, discount_percent: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={labelStyle}>Description</label>
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Tier description for internal use" style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={sectionBox}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".1em", color: "#7A7880", marginBottom: "14px" }}>TAX &amp; PAYMENT</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Payment Terms</label>
                  <select value={form.payment_terms} onChange={e => setForm(f => ({ ...f, payment_terms: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="immediate">Immediate</option>
                    <option value="net15">NET 15</option>
                    <option value="net30">NET 30</option>
                    <option value="net60">NET 60</option>
                    <option value="net90">NET 90</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Credit Limit ($)</label>
                  <input type="number" min="0" value={form.credit_limit} onChange={e => setForm(f => ({ ...f, credit_limit: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>MOQ (units)</label>
                  <input type="number" min="0" value={form.moq} onChange={e => setForm(f => ({ ...f, moq: parseInt(e.target.value) || 0 }))} style={inputStyle} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#fff", borderRadius: "8px", border: "1px solid #E2E0DA" }}>
                  <input type="checkbox" id="tax_exempt" checked={form.tax_exempt} onChange={e => setForm(f => ({ ...f, tax_exempt: e.target.checked }))} style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#1A5CFF" }} />
                  <label htmlFor="tax_exempt" style={{ fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Tax Exempt</label>
                </div>
                {!form.tax_exempt && (
                  <div>
                    <label style={labelStyle}>Custom Tax %</label>
                    <input type="number" min="0" max="30" step="0.1" value={form.tax_percentage} onChange={e => setForm(f => ({ ...f, tax_percentage: parseFloat(e.target.value) || 0 }))} style={inputStyle} />
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#fff", borderRadius: "8px", border: "1px solid #E2E0DA" }}>
                  <input type="checkbox" id="priority" checked={form.priority_support} onChange={e => setForm(f => ({ ...f, priority_support: e.target.checked }))} style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#1A5CFF" }} />
                  <label htmlFor="priority" style={{ fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Priority Support</label>
                </div>
              </div>
            </div>

            <div style={sectionBox}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".1em", color: "#7A7880" }}>VOLUME PRICING BREAKS</div>
                <button onClick={() => setForm(f => ({ ...f, volume_breaks: [...f.volume_breaks, { min_qty: 100, discount: 5 }] }))} style={{ padding: "5px 12px", background: "#1A5CFF", color: "#fff", border: "none", borderRadius: "5px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>+ Add Break</button>
              </div>
              {form.volume_breaks.length === 0 ? (
                <div style={{ textAlign: "center", color: "#bbb", fontSize: "13px", padding: "16px" }}>No volume breaks — flat discount applied to all quantities</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {form.volume_breaks.map((vb, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#fff", padding: "10px 14px", borderRadius: "7px", border: "1px solid #E2E0DA" }}>
                      <span style={{ fontSize: "13px", color: "#7A7880", minWidth: "60px" }}>Min Qty:</span>
                      <input type="number" value={vb.min_qty} onChange={e => setVB(i, "min_qty", parseInt(e.target.value) || 0)} style={{ width: "80px", padding: "7px", border: "1px solid #E2E0DA", borderRadius: "5px", fontSize: "13px", textAlign: "center", outline: "none" }} />
                      <span style={{ fontSize: "13px", color: "#7A7880" }}>units →</span>
                      <input type="number" value={vb.discount} onChange={e => setVB(i, "discount", parseFloat(e.target.value) || 0)} style={{ width: "70px", padding: "7px", border: "1px solid #E2E0DA", borderRadius: "5px", fontSize: "13px", textAlign: "center", outline: "none" }} />
                      <span style={{ fontSize: "13px", color: "#7A7880" }}>% off</span>
                      <button onClick={() => setForm(f => ({ ...f, volume_breaks: f.volume_breaks.filter((_, idx) => idx !== i) }))} style={{ marginLeft: "auto", background: "none", border: "none", color: "#E8242A", cursor: "pointer", fontSize: "16px" }}>
                        <TrashIcon size={14} color="#E8242A" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={closeModal} style={{ padding: "11px 22px", border: "1px solid #E2E0DA", borderRadius: "8px", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "11px 22px", background: saving ? "#aaa" : "#1A5CFF", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving…" : editingId ? "Save Changes" : "Create Tier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DISCOUNT GROUP CREATE/EDIT MODAL ──────────────────────────────── */}
      {showGroupModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "640px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", color: "#2A2830" }}>
                {editingGroupId ? "EDIT DISCOUNT GROUP" : "CREATE DISCOUNT GROUP"}
              </h2>
              <button onClick={() => setShowGroupModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#7A7880", lineHeight: 1 }}>✕</button>
            </div>

            {/* Status toggle */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#7A7880" }}>Status</span>
                <div
                  onClick={() => setGroupForm(f => ({ ...f, status: f.status === "enabled" ? "disabled" : "enabled" }))}
                  style={{ position: "relative", width: "44px", height: "24px", borderRadius: "12px", background: groupForm.status === "enabled" ? "#059669" : "#E2E0DA", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: "3px", left: groupForm.status === "enabled" ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: groupForm.status === "enabled" ? "#059669" : "#7A7880" }}>{groupForm.status === "enabled" ? "Enabled" : "Disabled"}</span>
              </label>
            </div>

            {/* Title + Tag */}
            <div style={sectionBox}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".1em", color: "#7A7880", marginBottom: "14px" }}>BASIC INFO</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input value={groupForm.title} onChange={e => setGroupForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Summer Sale Group" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Customer Tag</label>
                  <input value={groupForm.customer_tag} onChange={e => setGroupForm(f => ({ ...f, customer_tag: e.target.value }))} placeholder="e.g. vip, wholesale-b" style={inputStyle} />
                  <p style={{ fontSize: "11px", color: "#7A7880", marginTop: "3px" }}>Customers with this tag get this group</p>
                </div>
              </div>
            </div>

            {/* Applies To */}
            <div style={sectionBox}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".1em", color: "#7A7880", marginBottom: "12px" }}>APPLIES TO</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(["store", "collections", "products"] as const).map(opt => (
                  <div key={opt}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: groupForm.applies_to === opt ? "rgba(26,92,255,.06)" : "#fff", border: `1.5px solid ${groupForm.applies_to === opt ? "#1A5CFF" : "#E2E0DA"}`, borderRadius: "7px", cursor: "pointer" }}>
                      <input type="radio" name="applies_to" value={opt} checked={groupForm.applies_to === opt} onChange={() => handleAppliesTo(opt)} style={{ accentColor: "#1A5CFF" }} />
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#2A2830" }}>
                          {opt === "store" ? "Entire Store" : opt === "collections" ? "Selected Collections" : "Selected Products"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#7A7880" }}>
                          {opt === "store" ? "Applies to all products" : opt === "collections" ? "Choose specific collections" : "Choose specific products"}
                        </div>
                      </div>
                    </label>

                    {/* Browse panel — shown when this option is selected and it's not "store" */}
                    {groupForm.applies_to === opt && opt !== "store" && (
                      <div style={{ marginTop: "8px", marginLeft: "12px", border: "1px solid #E2E0DA", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                        {/* Search inside browse */}
                        <div style={{ padding: "8px 12px", borderBottom: "1px solid #E2E0DA", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "13px", color: "#aaa" }}>🔍</span>
                          <input
                            value={browseSearch}
                            onChange={e => setBrowseSearch(e.target.value)}
                            placeholder={`Search ${opt}…`}
                            style={{ flex: 1, border: "none", outline: "none", fontSize: "13px", fontFamily: "var(--font-jakarta)" }}
                          />
                          {browseIds.length > 0 && (
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1A5CFF", whiteSpace: "nowrap" }}>
                              {browseIds.length} selected
                            </span>
                          )}
                        </div>

                        {/* List */}
                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                          {browseLoading ? (
                            <div style={{ padding: "20px", textAlign: "center", color: "#bbb", fontSize: "12px" }}>Loading…</div>
                          ) : browseList.length === 0 ? (
                            <div style={{ padding: "20px", textAlign: "center", color: "#bbb", fontSize: "12px" }}>
                              No {opt} found
                            </div>
                          ) : (
                            browseList
                              .filter(item => !browseSearch || item.name.toLowerCase().includes(browseSearch.toLowerCase()))
                              .map(item => (
                                <label key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", cursor: "pointer", borderBottom: "1px solid #F4F3EF", background: browseIds.includes(item.id) ? "rgba(26,92,255,.04)" : "transparent" }}>
                                  <input
                                    type="checkbox"
                                    checked={browseIds.includes(item.id)}
                                    onChange={e => setBrowseIds(prev => e.target.checked ? [...prev, item.id] : prev.filter(id => id !== item.id))}
                                    style={{ accentColor: "#1A5CFF", width: "15px", height: "15px", flexShrink: 0 }}
                                  />
                                  <span style={{ fontSize: "13px", color: "#2A2830" }}>{item.name}</span>
                                </label>
                              ))
                          )}
                        </div>

                        {/* Selected summary */}
                        {browseIds.length > 0 && (
                          <div style={{ padding: "8px 14px", borderTop: "1px solid #E2E0DA", background: "#F4F3EF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "12px", color: "#2A2830", fontWeight: 600 }}>
                              {browseIds.length} {opt === "collections" ? "collection" : "product"}{browseIds.length !== 1 ? "s" : ""} selected
                            </span>
                            <button onClick={() => setBrowseIds([])} style={{ background: "none", border: "none", fontSize: "12px", color: "#E8242A", cursor: "pointer", fontWeight: 600 }}>Clear all</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Minimum Requirements */}
            <div style={sectionBox}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".1em", color: "#7A7880", marginBottom: "12px" }}>MINIMUM REQUIREMENTS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(["none", "amount", "quantity"] as const).map(opt => (
                  <label key={opt} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: groupForm.min_req_type === opt ? "rgba(26,92,255,.06)" : "#fff", border: `1.5px solid ${groupForm.min_req_type === opt ? "#1A5CFF" : "#E2E0DA"}`, borderRadius: "7px", cursor: "pointer" }}>
                    <input type="radio" name="min_req" value={opt} checked={groupForm.min_req_type === opt} onChange={() => setGroupForm(f => ({ ...f, min_req_type: opt }))} style={{ accentColor: "#1A5CFF" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2A2830" }}>
                        {opt === "none" ? "No minimum" : opt === "amount" ? "Minimum purchase amount" : "Minimum quantity of items"}
                      </div>
                    </div>
                    {groupForm.min_req_type === opt && opt !== "none" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {opt === "amount" && <span style={{ fontSize: "13px", color: "#7A7880" }}>$</span>}
                        <input
                          type="number"
                          value={groupForm.min_req_value}
                          onChange={e => setGroupForm(f => ({ ...f, min_req_value: parseFloat(e.target.value) || 0 }))}
                          style={{ width: "90px", padding: "6px 8px", border: "1px solid #E2E0DA", borderRadius: "5px", fontSize: "13px", textAlign: "center" }}
                        />
                        {opt === "quantity" && <span style={{ fontSize: "13px", color: "#7A7880" }}>units</span>}
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping Rate */}
            <div style={sectionBox}>
              <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".1em", color: "#7A7880", marginBottom: "12px" }}>SHIPPING RATE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Store Default */}
                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: groupForm.shipping_type === "store_default" ? "rgba(26,92,255,.06)" : "#fff", border: `1.5px solid ${groupForm.shipping_type === "store_default" ? "#1A5CFF" : "#E2E0DA"}`, borderRadius: "7px", cursor: "pointer" }}>
                  <input type="radio" name="shipping_type" value="store_default" checked={groupForm.shipping_type === "store_default"} onChange={() => setGroupForm(f => ({ ...f, shipping_type: "store_default" }))} style={{ accentColor: "#1A5CFF" }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#2A2830" }}>Store Default</div>
                    <div style={{ fontSize: "11px", color: "#7A7880" }}>Use the customer's assigned shipping tier</div>
                  </div>
                </label>

                {/* Flat Rate */}
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: groupForm.shipping_type === "flat_rate" ? "rgba(26,92,255,.06)" : "#fff", border: `1.5px solid ${groupForm.shipping_type === "flat_rate" ? "#1A5CFF" : "#E2E0DA"}`, borderRadius: "7px", cursor: "pointer" }}>
                    <input type="radio" name="shipping_type" value="flat_rate" checked={groupForm.shipping_type === "flat_rate"} onChange={() => setGroupForm(f => ({ ...f, shipping_type: "flat_rate" }))} style={{ accentColor: "#1A5CFF" }} />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2A2830" }}>Flat Rate</div>
                      <div style={{ fontSize: "11px", color: "#7A7880" }}>Define shipping rates by order amount brackets</div>
                    </div>
                  </label>

                  {/* Bracket editor — only when Flat Rate is selected */}
                  {groupForm.shipping_type === "flat_rate" && (
                    <div style={{ marginTop: "10px", marginLeft: "12px", border: "1px solid #E2E0DA", borderRadius: "8px", background: "#fff", overflow: "hidden" }}>
                      {/* Header row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: "0", background: "#FAFAF8", borderBottom: "1px solid #E2E0DA" }}>
                        <div style={{ padding: "8px 14px", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".06em" }}>Min Order Amount</div>
                        <div style={{ padding: "8px 14px", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".06em" }}>Shipping Rate</div>
                        <div />
                      </div>

                      {/* Bracket rows */}
                      {flatBrackets.length === 0 ? (
                        <div style={{ padding: "16px", textAlign: "center", fontSize: "12px", color: "#bbb" }}>
                          No brackets — add one to set a shipping rate
                        </div>
                      ) : flatBrackets.map((bracket, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: "0", borderBottom: i < flatBrackets.length - 1 ? "1px solid #F4F3EF" : "none" }}>
                          <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontSize: "13px", color: "#7A7880" }}>$</span>
                            <input
                              type="number"
                              min="0"
                              value={bracket.min_order}
                              onChange={e => updateBracket(i, "min_order", parseFloat(e.target.value) || 0)}
                              style={{ width: "100%", padding: "6px 8px", border: "1px solid #E2E0DA", borderRadius: "5px", fontSize: "13px" }}
                            />
                          </div>
                          <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontSize: "13px", color: "#7A7880" }}>$</span>
                            <input
                              type="number"
                              min="0"
                              value={bracket.rate}
                              onChange={e => updateBracket(i, "rate", parseFloat(e.target.value) || 0)}
                              style={{ width: "100%", padding: "6px 8px", border: "1px solid #E2E0DA", borderRadius: "5px", fontSize: "13px" }}
                            />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <button
                              onClick={() => setFlatBrackets(prev => prev.filter((_, idx) => idx !== i))}
                              style={{ background: "none", border: "none", color: "#E8242A", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}
                            >✕</button>
                          </div>
                        </div>
                      ))}

                      {/* Add bracket */}
                      <div style={{ padding: "8px 14px", borderTop: flatBrackets.length > 0 ? "1px solid #E2E0DA" : "none" }}>
                        <button
                          onClick={() => setFlatBrackets(prev => [...prev, { min_order: 0, rate: 0 }])}
                          style={{ background: "none", border: "1px dashed #1A5CFF", color: "#1A5CFF", padding: "5px 14px", borderRadius: "5px", fontSize: "12px", fontWeight: 700, cursor: "pointer", width: "100%" }}
                        >
                          + Add Bracket
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowGroupModal(false)} style={{ padding: "11px 22px", border: "1px solid #E2E0DA", borderRadius: "8px", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>Cancel</button>
              <button onClick={handleSaveGroup} disabled={savingGroup} style={{ padding: "11px 22px", background: savingGroup ? "#aaa" : "#1A5CFF", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: savingGroup ? "not-allowed" : "pointer" }}>
                {savingGroup ? "Saving…" : editingGroupId ? "Save Changes" : "Create Group"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
