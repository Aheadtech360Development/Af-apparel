"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { productsService } from "@/services/products.service";
import { cartService } from "@/services/cart.service";
import type { ProductListItem, ProductDetail, ProductVariant } from "@/types/product.types";

// ─── Size ordering ────────────────────────────────────────────────────────────
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a);
    const ib = SIZE_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

// ─── Color map ────────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  White: "#FFFFFF", Black: "#111111", Navy: "#1e3a5f", Red: "#E8242A",
  Blue: "#1A5CFF", Royal: "#2251CC", "Royal Blue": "#2251CC",
  Grey: "#9ca3af", Gray: "#9ca3af", "Dark Grey": "#4b5563", "Dark Gray": "#4b5563",
  "Light Grey": "#d1d5db", "Light Gray": "#d1d5db", Charcoal: "#374151",
  Heather: "#b0b7c3", Sand: "#e2c89a", Natural: "#f5f0e8", Tan: "#c9a96e",
  Brown: "#78350f", Maroon: "#7f1d1d", Burgundy: "#881337", Green: "#166534",
  "Forest Green": "#14532d", "Kelly Green": "#15803d", Lime: "#65a30d",
  Yellow: "#eab308", Gold: "#C9A84C", Orange: "#ea580c", Purple: "#7c3aed",
  Pink: "#ec4899", "Hot Pink": "#db2777", Coral: "#f87171", Teal: "#0d9488",
  Turquoise: "#06b6d4", Mint: "#6ee7b7", Olive: "#4d7c0f", Cream: "#fef3c7",
  Ivory: "#fffff0", "Sky Blue": "#38bdf8", Lavender: "#a78bfa",
};

// ─── Row state ────────────────────────────────────────────────────────────────
interface QuickOrderRow {
  id: string;
  searchQuery: string;
  selectedProduct: ProductListItem | null;
  productDetail: ProductDetail | null;
  showDropdown: boolean;
  searchResults: ProductListItem[];
  selectedColor: string;
  quantities: Record<string, number>;
  isSearching: boolean;
  isLoadingDetail: boolean;
  checked: boolean;
}

function makeRow(): QuickOrderRow {
  return {
    id: Math.random().toString(36).slice(2),
    searchQuery: "",
    selectedProduct: null,
    productDetail: null,
    showDropdown: false,
    searchResults: [],
    selectedColor: "",
    quantities: {},
    isSearching: false,
    isLoadingDetail: false,
    checked: false,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuickOrderPage() {
  const [rows, setRows] = useState<QuickOrderRow[]>([makeRow(), makeRow(), makeRow()]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const searchTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // ── Helpers ────────────────────────────────────────────────────────────
  function updateRow(id: string, updates: Partial<QuickOrderRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }

  function getRowColors(row: QuickOrderRow): string[] {
    if (!row.productDetail) return [];
    return Array.from(new Set(row.productDetail.variants.map((v) => v.color).filter(Boolean))) as string[];
  }

  function getRowSizes(row: QuickOrderRow): string[] {
    if (!row.productDetail || !row.selectedColor) return [];
    return sortSizes(
      Array.from(new Set(
        row.productDetail.variants
          .filter((v) => v.color === row.selectedColor && v.size)
          .map((v) => v.size!)
      ))
    );
  }

  function getVariant(row: QuickOrderRow, size: string): ProductVariant | undefined {
    return row.productDetail?.variants.find((v) => v.color === row.selectedColor && v.size === size);
  }

  function getRowTotals(row: QuickOrderRow): { units: number; price: number } {
    let units = 0, price = 0;
    for (const size of getRowSizes(row)) {
      const qty = row.quantities[size] ?? 0;
      if (qty > 0) {
        const v = getVariant(row, size);
        units += qty;
        price += qty * parseFloat(v?.effective_price ?? v?.retail_price ?? "0");
      }
    }
    return { units, price };
  }

  // ── Search ─────────────────────────────────────────────────────────────
  function handleSearchChange(rowId: string, value: string) {
    updateRow(rowId, { searchQuery: value, selectedProduct: null, productDetail: null, selectedColor: "", quantities: {}, showDropdown: false });
    if (searchTimers.current[rowId]) clearTimeout(searchTimers.current[rowId]);
    if (value.length < 2) { updateRow(rowId, { searchResults: [] }); return; }
    updateRow(rowId, { isSearching: true });
    searchTimers.current[rowId] = setTimeout(async () => {
      try {
        const result = await productsService.listProducts({ q: value, page_size: 10 });
        setRows((prev) => prev.map((r) =>
          r.id === rowId ? { ...r, searchResults: result.items, showDropdown: true, isSearching: false } : r
        ));
      } catch {
        setRows((prev) => prev.map((r) => r.id === rowId ? { ...r, searchResults: [], isSearching: false } : r));
      }
    }, 300);
  }

  async function handleSelectProduct(rowId: string, product: ProductListItem) {
    updateRow(rowId, { selectedProduct: product, searchQuery: product.name, showDropdown: false, searchResults: [], isLoadingDetail: true, selectedColor: "", quantities: {} });
    try {
      const detail = await productsService.getProductBySlug(product.slug);
      const colors = Array.from(new Set(detail.variants.map((v) => v.color).filter(Boolean))) as string[];
      setRows((prev) => prev.map((r) =>
        r.id === rowId ? { ...r, productDetail: detail, selectedColor: colors[0] ?? "", isLoadingDetail: false } : r
      ));
    } catch {
      setRows((prev) => prev.map((r) => r.id === rowId ? { ...r, isLoadingDetail: false } : r));
    }
  }

  function handleQtyChange(rowId: string, size: string, value: string) {
    const qty = parseInt(value, 10);
    setRows((prev) => prev.map((r) =>
      r.id === rowId ? { ...r, quantities: { ...r.quantities, [size]: isNaN(qty) || qty < 0 ? 0 : qty } } : r
    ));
  }

  // ── Add to cart ─────────────────────────────────────────────────────────
  async function handleAddToCart() {
    const activeRows = rows.filter((r) => r.productDetail && getRowTotals(r).units > 0);
    if (activeRows.length === 0) {
      setCartMsg({ type: "error", text: "Enter quantities in at least one row before adding to cart." });
      setTimeout(() => setCartMsg(null), 4000);
      return;
    }
    setIsAddingToCart(true);
    setCartMsg(null);
    let added = 0, errors = 0;
    for (const row of activeRows) {
      const items = getRowSizes(row)
        .filter((size) => (row.quantities[size] ?? 0) > 0)
        .flatMap((size) => {
          const v = getVariant(row, size);
          const qty = row.quantities[size];
          if (!v || !qty) return [];
          return [{ variant_id: v.id, quantity: qty }];
        });
      if (items.length > 0) {
        try { await cartService.addMatrix(row.productDetail!.id, items); added++; }
        catch { errors++; }
      }
    }
    setIsAddingToCart(false);
    if (errors > 0) {
      setCartMsg({ type: "error", text: `${errors} product${errors !== 1 ? "s" : ""} failed to add.` });
    } else {
      setCartMsg({ type: "success", text: `${added} product${added !== 1 ? "s" : ""} added to cart.` });
    }
    setTimeout(() => setCartMsg(null), 5000);
  }

  // ── Row actions ─────────────────────────────────────────────────────────
  function deleteRow(id: string) {
    setRows((prev) => (prev.length === 1 ? [makeRow()] : prev.filter((r) => r.id !== id)));
  }

  function copyRow(id: string) {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx === -1) return prev;
      const src = prev[idx]!;
      const copy: QuickOrderRow = {
        searchQuery: src.searchQuery, selectedProduct: src.selectedProduct,
        productDetail: src.productDetail, showDropdown: false,
        searchResults: src.searchResults, selectedColor: src.selectedColor,
        isSearching: false, isLoadingDetail: false,
        id: Math.random().toString(36).slice(2),
        quantities: { ...src.quantities }, checked: false,
      };
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
    });
  }

  function deleteChecked() {
    setRows((prev) => { const r = prev.filter((r) => !r.checked); return r.length > 0 ? r : [makeRow()]; });
  }

  const checkedCount = rows.filter((r) => r.checked).length;
  const grandTotals = rows.reduce((acc, r) => {
    const t = getRowTotals(r);
    return { units: acc.units + t.units, price: acc.price + t.price };
  }, { units: 0, price: 0 });

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{ minHeight: "100vh", background: "#F4F3EF", fontFamily: "var(--font-jakarta)", display: "flex", flexDirection: "column" }}
      onClick={() => setRows((prev) => prev.map((r) => ({ ...r, showDropdown: false })))}
    >
      {/* ══ PAGE HEADER ══════════════════════════════════════════════════ */}
      <div style={{ background: "#080808", padding: "40px 32px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", color: "#444", marginBottom: "6px" }}>
              Wholesale
            </div>
            <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(32px,4vw,52px)", color: "#fff", letterSpacing: ".02em", lineHeight: 1, marginBottom: "6px" }}>
              Quick Order
            </h1>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.5 }}>
              Search by style name or SKU · select color · enter quantities by size
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {grandTotals.units > 0 && (
              <div style={{ padding: "8px 14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", fontSize: "13px", color: "#aaa", whiteSpace: "nowrap" }}>
                <span style={{ fontWeight: 700, color: "#fff" }}>{grandTotals.units}</span>
                {" units · "}
                <span style={{ fontWeight: 700, color: "#C9A84C" }}>{formatCurrency(grandTotals.price)}</span>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              disabled={isAddingToCart || grandTotals.units === 0}
              style={{
                background: grandTotals.units === 0 ? "#222" : "#1A5CFF",
                color: grandTotals.units === 0 ? "#555" : "#fff",
                padding: "12px 24px", fontSize: "13px", fontWeight: 700,
                borderRadius: "6px", border: "none",
                cursor: grandTotals.units === 0 ? "not-allowed" : "pointer",
                textTransform: "uppercase", letterSpacing: ".06em", whiteSpace: "nowrap",
                transition: "background .2s",
              }}
            >
              {isAddingToCart ? "Adding…" : "Add to Shopping Box"}
            </button>
          </div>
        </div>
      </div>

      {/* ══ TOOLBAR ══════════════════════════════════════════════════════ */}
      <div style={{ background: "#F4F3EF", borderBottom: "1px solid #E2E0DA", padding: "10px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#7A7880" }}>
            {rows.length} style{rows.length !== 1 ? "s" : ""}
          </span>
          {checkedCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); deleteChecked(); }}
              style={{ padding: "5px 12px", fontSize: "12px", fontWeight: 700, color: "#dc2626", background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.2)", borderRadius: "4px", cursor: "pointer" }}
            >
              Remove {checkedCount} selected
            </button>
          )}

          {/* Cart message inline in toolbar */}
          {cartMsg && (
            <div style={{
              padding: "6px 12px", borderRadius: "5px", fontSize: "12px", fontWeight: 600,
              display: "flex", alignItems: "center", gap: "8px",
              background: cartMsg.type === "success" ? "rgba(22,163,74,.1)" : "rgba(220,38,38,.1)",
              border: `1px solid ${cartMsg.type === "success" ? "rgba(22,163,74,.3)" : "rgba(220,38,38,.3)"}`,
              color: cartMsg.type === "success" ? "#16a34a" : "#dc2626",
            }}>
              {cartMsg.type === "success" ? "✓" : "✕"} {cartMsg.text}
              {cartMsg.type === "success" && (
                <Link href="/cart" style={{ color: "#1A5CFF", textDecoration: "none", fontWeight: 700, marginLeft: "4px" }}>View Cart →</Link>
              )}
            </div>
          )}

          <div style={{ marginLeft: "auto", display: "flex", gap: "20px", alignItems: "center" }}>
            <Link href="/products" style={{ fontSize: "12px", fontWeight: 600, color: "#1A5CFF", textDecoration: "none" }}>Browse Catalog →</Link>
            <Link href="/cart" style={{ fontSize: "12px", fontWeight: 600, color: "#1A5CFF", textDecoration: "none" }}>View Cart</Link>
          </div>
        </div>
      </div>

      {/* ══ ROWS ═════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, maxWidth: "1400px", width: "100%", margin: "0 auto", padding: "16px 32px 120px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rows.map((row, rowIdx) => {
            const colors = getRowColors(row);
            const sizes = getRowSizes(row);
            const { units, price } = getRowTotals(row);
            const colorHex = COLOR_MAP[row.selectedColor] ?? "#888";
            const isLightColor = ["#FFFFFF", "#fffff0", "#fef3c7", "#f5f0e8", "#fef9c3"].includes(colorHex);

            return (
              <div
                key={row.id}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  border: `1px solid ${row.checked ? "#1A5CFF" : "#E2E0DA"}`,
                  borderRadius: "10px",
                  overflow: "visible",
                  boxShadow: row.checked ? "0 0 0 3px rgba(26,92,255,.08)" : "0 1px 3px rgba(0,0,0,.04)",
                  transition: "border-color .15s, box-shadow .15s",
                }}
              >
                {/* ── TOP BAR ── */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "0",
                  height: "52px", borderBottom: (row.selectedProduct || sizes.length > 0) ? "1px solid #E2E0DA" : "none",
                  paddingLeft: "12px", paddingRight: "12px",
                }}>
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={(e) => updateRow(row.id, { checked: e.target.checked })}
                    style={{ width: "14px", height: "14px", cursor: "pointer", accentColor: "#1A5CFF", flexShrink: 0, marginRight: "10px" }}
                  />

                  {/* Row number */}
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#ccc", width: "20px", flexShrink: 0, userSelect: "none" }}>
                    {rowIdx + 1}
                  </span>

                  {/* Search input — flex:1, borderless except bottom */}
                  <div style={{ position: "relative", flex: 1, height: "100%", display: "flex", alignItems: "center" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={row.isSearching ? "#1A5CFF" : "#bbb"} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "10px", pointerEvents: "none", flexShrink: 0 }}>
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      value={row.searchQuery}
                      onChange={(e) => handleSearchChange(row.id, e.target.value)}
                      onBlur={() => setTimeout(() => updateRow(row.id, { showDropdown: false }), 150)}
                      onFocus={() => { if (row.searchResults.length > 0 && !row.selectedProduct) updateRow(row.id, { showDropdown: true }); }}
                      placeholder={row.isLoadingDetail ? "Loading…" : "Style # or product name…"}
                      disabled={row.isLoadingDetail}
                      style={{
                        width: "100%", height: "100%",
                        border: "none", outline: "none",
                        paddingLeft: "30px", paddingRight: "10px",
                        fontSize: "13px", color: "#2A2830",
                        background: "transparent",
                        fontFamily: "var(--font-jakarta)",
                      }}
                    />
                    {/* Autocomplete dropdown */}
                    {row.showDropdown && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0,
                        background: "#fff", border: "1px solid #E2E0DA", borderRadius: "8px",
                        boxShadow: "0 8px 28px rgba(0,0,0,.12)", zIndex: 300,
                        overflow: "hidden", maxHeight: "320px", overflowY: "auto",
                      }}>
                        {row.searchResults.length > 0 ? (
                          row.searchResults.map((product) => {
                            const img = product.primary_image;
                            const unitPrice = product.variants[0]?.effective_price ?? product.variants[0]?.retail_price;
                            return (
                              <button
                                key={product.id}
                                onMouseDown={(e) => { e.preventDefault(); handleSelectProduct(row.id, product); }}
                                style={{
                                  width: "100%", display: "flex", alignItems: "center", gap: "10px",
                                  padding: "10px 14px", background: "none", border: "none",
                                  borderBottom: "1px solid #F4F3EF", cursor: "pointer", textAlign: "left",
                                }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F8F7F5")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "none")}
                              >
                                <div style={{ width: "38px", height: "38px", flexShrink: 0, borderRadius: "5px", overflow: "hidden", background: "#F4F3EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {img ? (
                                    <Image src={img.url_thumbnail_webp ?? img.url_thumbnail} alt={img.alt_text ?? product.name} width={38} height={38} style={{ objectFit: "cover" }} />
                                  ) : (
                                    <span style={{ fontSize: "16px" }}>👕</span>
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#2A2830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</div>
                                  <div style={{ fontSize: "11px", color: "#7A7880" }}>
                                    {product.variants[0]?.sku ?? product.slug}
                                    {product.categories[0] && <span style={{ marginLeft: "6px" }}>· {product.categories[0].name}</span>}
                                  </div>
                                </div>
                                {unitPrice && (
                                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#E8242A", flexShrink: 0 }}>
                                    {formatCurrency(parseFloat(unitPrice))}
                                  </div>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div style={{ padding: "16px 14px", fontSize: "13px", color: "#7A7880", textAlign: "center" }}>
                            No products found for &quot;{row.searchQuery}&quot;
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  {colors.length > 0 && <div style={{ width: "1px", height: "28px", background: "#E2E0DA", flexShrink: 0, margin: "0 4px" }} />}

                  {/* Color selector with dot */}
                  {colors.length > 0 && (
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 10px", height: "36px", cursor: "pointer" }}>
                        <div style={{
                          width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                          background: colorHex,
                          border: isLightColor ? "1px solid #E2E0DA" : "1px solid rgba(0,0,0,.12)",
                        }} />
                        <select
                          value={row.selectedColor}
                          onChange={(e) => updateRow(row.id, { selectedColor: e.target.value, quantities: {} })}
                          style={{
                            appearance: "none", WebkitAppearance: "none",
                            border: "none", outline: "none", background: "transparent",
                            fontSize: "13px", fontWeight: 600, color: "#2A2830",
                            cursor: "pointer", paddingRight: "16px",
                            fontFamily: "var(--font-jakarta)",
                          }}
                        >
                          {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {/* chevron */}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7A7880" strokeWidth={2.5} strokeLinecap="round" style={{ position: "absolute", right: "2px", pointerEvents: "none" }}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div style={{ width: "1px", height: "28px", background: "#E2E0DA", flexShrink: 0, margin: "0 4px" }} />

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
                    <IconBtn title="Duplicate row" onClick={() => copyRow(row.id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    </IconBtn>
                    <IconBtn title="Remove row" danger onClick={() => deleteRow(row.id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </IconBtn>
                  </div>
                </div>

                {/* ── CARD BODY ── */}
                {(row.selectedProduct || row.isLoadingDetail) && (
                  <div style={{ padding: "16px 20px 20px" }}>
                    {row.isLoadingDetail ? (
                      <div style={{ fontSize: "13px", color: "#7A7880", padding: "8px 0" }}>Loading product details…</div>
                    ) : (
                      <>
                        {/* Product info row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid #F4F3EF" }}>
                          {/* Thumbnail */}
                          <div style={{ width: "44px", height: "44px", flexShrink: 0, borderRadius: "6px", overflow: "hidden", background: "#F4F3EF", border: "1px solid #E2E0DA" }}>
                            {row.selectedProduct?.primary_image ? (
                              <Image
                                src={row.selectedProduct.primary_image.url_thumbnail_webp ?? row.selectedProduct.primary_image.url_thumbnail}
                                alt={row.selectedProduct.name}
                                width={44} height={44}
                                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👕</div>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#2A2830", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {row.selectedProduct?.name}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                              <span style={{ fontSize: "11px", color: "#7A7880", fontFamily: "monospace" }}>
                                {row.selectedProduct?.variants[0]?.sku ?? row.selectedProduct?.slug}
                              </span>
                              {row.selectedProduct && row.selectedProduct.moq > 1 && (
                                <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "3px", background: "rgba(201,168,76,.15)", color: "#7a5a00", textTransform: "uppercase", letterSpacing: ".04em" }}>
                                  Min {row.selectedProduct.moq} units
                                </span>
                              )}
                              {row.selectedProduct?.categories[0] && (
                                <span style={{ fontSize: "11px", color: "#bbb" }}>{row.selectedProduct.categories[0].name}</span>
                              )}
                            </div>
                          </div>
                          {/* Color preview */}
                          {row.selectedColor && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: "#F4F3EF", borderRadius: "5px", border: "1px solid #E2E0DA", flexShrink: 0 }}>
                              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: colorHex, border: isLightColor ? "1px solid #E2E0DA" : "1px solid rgba(0,0,0,.1)", flexShrink: 0 }} />
                              <span style={{ fontSize: "12px", fontWeight: 600, color: "#2A2830" }}>{row.selectedColor}</span>
                            </div>
                          )}
                        </div>

                        {/* Size grid */}
                        {sizes.length > 0 ? (
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ borderCollapse: "separate", borderSpacing: "6px 0", fontSize: "13px" }}>
                              <thead>
                                <tr>
                                  {sizes.map((size) => {
                                    const v = getVariant(row, size);
                                    const unitPrice = v?.effective_price ?? v?.retail_price;
                                    return (
                                      <th key={size} style={{ padding: "0 0 8px", textAlign: "center", minWidth: "64px" }}>
                                        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "15px", letterSpacing: ".06em", color: "#2A2830" }}>{size}</div>
                                        {unitPrice && (
                                          <div style={{ fontSize: "10px", color: "#7A7880", fontWeight: 400, fontFamily: "var(--font-jakarta)" }}>
                                            {formatCurrency(parseFloat(unitPrice))}
                                          </div>
                                        )}
                                      </th>
                                    );
                                  })}
                                  {/* Total header */}
                                  <th style={{ padding: "0 0 8px 16px", textAlign: "right", minWidth: "90px", borderLeft: "1px solid #E2E0DA" }}>
                                    <div style={{ fontFamily: "var(--font-bebas)", fontSize: "15px", letterSpacing: ".06em", color: "#2A2830" }}>Total</div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  {sizes.map((size) => {
                                    const qty = row.quantities[size] ?? 0;
                                    return (
                                      <td key={size} style={{ padding: 0, textAlign: "center" }}>
                                        <input
                                          type="number"
                                          min={0}
                                          value={qty === 0 ? "" : qty}
                                          onChange={(e) => handleQtyChange(row.id, size, e.target.value)}
                                          placeholder="0"
                                          style={{
                                            width: "64px", height: "44px",
                                            textAlign: "center", fontSize: "16px", fontWeight: 700,
                                            border: qty > 0 ? "1.5px solid #1A5CFF" : "1.5px solid #E2E0DA",
                                            borderRadius: "6px", outline: "none",
                                            background: qty > 0 ? "rgba(26,92,255,.04)" : "#fff",
                                            color: "#2A2830", transition: "border-color .15s, background .15s",
                                            fontFamily: "var(--font-jakarta)",
                                            MozAppearance: "textfield",
                                          }}
                                        />
                                      </td>
                                    );
                                  })}
                                  {/* Total cell */}
                                  <td style={{ padding: "0 0 0 16px", textAlign: "right", verticalAlign: "middle", borderLeft: "1px solid #E2E0DA" }}>
                                    {units > 0 ? (
                                      <div>
                                        <div style={{ fontSize: "11px", color: "#7A7880", marginBottom: "2px" }}>{units} units</div>
                                        <div style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", letterSpacing: ".02em", color: "#1A5CFF", lineHeight: 1 }}>
                                          {formatCurrency(price)}
                                        </div>
                                      </div>
                                    ) : (
                                      <span style={{ fontSize: "13px", color: "#ddd" }}>—</span>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div style={{ fontSize: "13px", color: "#7A7880", fontStyle: "italic" }}>
                            Select a color to see available sizes
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Empty state */}
                {!row.selectedProduct && !row.isLoadingDetail && (
                  <div style={{ padding: "14px 20px 16px 46px", fontSize: "12px", color: "#ccc", fontStyle: "italic" }}>
                    Search for a style above
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ STICKY BOTTOM BAR ════════════════════════════════════════════ */}
      <div style={{
        position: "sticky", bottom: 0, background: "#fff",
        borderTop: "1px solid #E2E0DA", padding: "14px 32px",
        display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
        zIndex: 50, boxShadow: "0 -4px 16px rgba(0,0,0,.06)",
      }}>
        {/* + Add Style */}
        <button
          onClick={() => setRows((prev) => [...prev, makeRow()])}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "10px 18px", background: "#fff",
            border: "1.5px dashed #E2E0DA", borderRadius: "7px",
            fontSize: "13px", fontWeight: 700, color: "#7A7880",
            cursor: "pointer", textTransform: "uppercase", letterSpacing: ".05em",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#1A5CFF"; b.style.color = "#1A5CFF"; }}
          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#E2E0DA"; b.style.color = "#7A7880"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Style
        </button>

        {grandTotals.units > 0 && (
          <>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#2A2830" }}>
              <span style={{ color: "#7A7880", fontWeight: 400 }}>
                {grandTotals.units} unit{grandTotals.units !== 1 ? "s" : ""}
              </span>
              {"  ·  "}
              <span style={{ color: "#E8242A", fontWeight: 700 }}>{formatCurrency(grandTotals.price)}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              disabled={isAddingToCart}
              style={{
                background: "#1A5CFF", color: "#fff",
                padding: "12px 28px", fontSize: "13px", fontWeight: 700,
                borderRadius: "6px", border: "none",
                cursor: isAddingToCart ? "not-allowed" : "pointer",
                textTransform: "uppercase", letterSpacing: ".06em",
              }}
            >
              {isAddingToCart ? "Adding…" : "Add to Shopping Box"}
            </button>
          </>
        )}
      </div>

      {/* ══ TIP BAR ══════════════════════════════════════════════════════ */}
      <div style={{ background: "#F4F3EF", borderTop: "1px solid #E2E0DA", padding: "12px 32px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <p style={{ fontSize: "12px", color: "#7A7880", margin: 0, flex: 1 }}>
          <strong style={{ color: "#2A2830" }}>Tip:</strong> Type min. 2 characters to search. Select a color then enter per-size quantities. All rows are added when you click "Add to Shopping Box".
        </p>
        <div style={{ display: "flex", gap: "20px", flexShrink: 0 }}>
          {[{ label: "Browse Catalog", href: "/products" }, { label: "Order History", href: "/account/orders" }, { label: "Addresses", href: "/account/addresses" }].map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: "12px", fontWeight: 600, color: "#1A5CFF", textDecoration: "none" }}>{l.label}</Link>
          ))}
        </div>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}

// ─── Icon button ──────────────────────────────────────────────────────────────
function IconBtn({ children, title, onClick, danger = false }: {
  children: React.ReactNode; title: string; onClick: () => void; danger?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? (danger ? "rgba(220,38,38,.07)" : "#F4F3EF") : "transparent",
        border: `1px solid ${hov ? (danger ? "rgba(220,38,38,.25)" : "#ddd") : "transparent"}`,
        borderRadius: "5px", cursor: "pointer",
        color: hov && danger ? "#dc2626" : "#aaa",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}
