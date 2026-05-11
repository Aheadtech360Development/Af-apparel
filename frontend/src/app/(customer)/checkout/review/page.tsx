// frontend/src/app/(customer)/checkout/review/page.tsx 
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkout.store";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { cartService } from "@/services/cart.service";
import { ordersService } from "@/services/orders.service";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import type { Cart } from "@/types/order.types";

type GuestCartEntry = { variant_id: string; quantity: number; product_id: string; product_name: string; slug: string; color: string | null; size: string | null; unit_price: number; image_url?: string | null };

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  is_default: boolean;
}

function brandDisplayName(brand: string): string {
  const b = brand.toLowerCase();
  if (b === "visa") return "Visa";
  if (b === "mastercard") return "Mastercard";
  if (b === "amex" || b === "american express") return "Amex";
  if (b === "discover") return "Discover";
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

const SHIPPING_LABELS: Record<string, string> = {
  standard: "Standard Ground",
  expedited: "Expedited (2-Day)",
  will_call: "Will Call Pickup",
};

const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px",
};

export default function CheckoutReviewPage() {
  const router = useRouter();
  const {
    shippingAddress, companyName, contactName, shippingPhone, shippingMethod,
    shippingCost,
    addressId, poNumber, orderNotes, setPoNumber, setOrderNotes,
    savedCardId, qbToken,
    setConfirmedOrder,
    taxRegion: storedTaxRegion,
    taxRate: storedTaxRate,
    taxAmount: storedTaxAmount,
    paymentMethod,
    achBankName, achAccountHolder, achRoutingNumber, achAccountLast4, achAccountType,
  } = useCheckoutStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const { isAuthenticated, isLoading: authIsLoading } = useAuthStore();
  const isGuest = !authIsLoading && !isAuthenticated();

  const [cart, setCart] = useState<Cart | null>(null);
  const [guestEntries, setGuestEntries] = useState<GuestCartEntry[]>([]);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_amount: number; discount_type: string } | null>(null);
  // Seed from checkout store; API fetch is a fallback in case user navigated directly here
  const [taxRate, setTaxRate] = useState<{ region: string; rate: number } | null>(
    storedTaxRate > 0 && storedTaxRegion ? { region: storedTaxRegion, rate: storedTaxRate } : null
  );
  const [freshTaxAmount, setFreshTaxAmount] = useState(0);

  // Derived values needed by useEffects below
  const guestSubtotalCalc = guestEntries.reduce((s, e) => s + e.unit_price * e.quantity, 0);
  const subtotal = isGuest ? guestSubtotalCalc : Number(cart?.subtotal ?? 0);
  const shipping = shippingCost;
  const couponDiscount = appliedCoupon ? Number(appliedCoupon.discount_amount) : 0;

  // Guard: must have shipping + payment
  useEffect(() => {
    if (!shippingAddress) {
      router.replace("/checkout/address");
    } else if (!savedCardId && !qbToken && paymentMethod !== "ach") {
      router.replace("/checkout/payment");
    }
  }, [shippingAddress, savedCardId, qbToken, paymentMethod, router]);

  useEffect(() => {
    if (!isGuest) {
      cartService.getCart().then(setCart).catch(() => {});
    } else {
      try {
        const entries: GuestCartEntry[] = JSON.parse(localStorage.getItem("af_guest_cart") || "[]");
        setGuestEntries(entries);
      } catch { /* ignore */ }
    }
  }, [isGuest]);

  useEffect(() => {
    if (!isGuest) {
      apiClient.get<SavedCard[]>("/api/v1/account/payment-methods").then(setSavedCards).catch(() => {});
    }
  }, [isGuest]);

  useEffect(() => {
    if (typeof window === "undefined" || isGuest) return;
    const saved = localStorage.getItem("af_coupon");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.code) setAppliedCoupon(parsed);
    } catch { /* ignore */ }
  }, [isGuest]);

  useEffect(() => {
    // Use stored tax rate if available from address step
    if (storedTaxRate > 0 && storedTaxRegion) {
      setTaxRate({ region: storedTaxRegion, rate: storedTaxRate });
      return;
    }
    // Fallback: fetch fresh if navigated directly to review (store empty)
    if (!shippingAddress?.state) return;
    const params = new URLSearchParams({
      region: shippingAddress.state.toUpperCase(),
      zip_code: shippingAddress.postal_code ?? "",
      city: shippingAddress.city ?? "",
      subtotal: String(subtotal),
      shipping: String(shipping),
      discount: String(couponDiscount),
    });
    apiClient.get<{ region: string; rate: number; tax_amount: number }>(`/api/v1/tax-rate?${params}`)
      .then(res => {
        const r = res as any;
        const rate = Number(r.rate ?? 0);
        const amount = Number(r.tax_amount ?? 0);
        setTaxRate(rate > 0 ? { region: r.region, rate } : null);
        if (amount > 0) setFreshTaxAmount(amount);
      })
      .catch(() => setTaxRate(null));
  }, [storedTaxRegion, storedTaxRate, shippingAddress?.state, couponDiscount]);

  function buildColorSummary(c: Cart): string {
    const colorMap = new Map<string, number>();
    for (const item of c.items) {
      const col = item.color ?? "Default";
      colorMap.set(col, (colorMap.get(col) ?? 0) + item.quantity);
    }
    return Array.from(colorMap.entries())
      .map(([color, units]) => `${color} x ${units} units`)
      .join(", ");
  }

  async function handlePlaceOrder() {
    if (!shippingAddress) return;
    setIsPlacing(true);
    setError(null);

    try {
      if (isGuest) {
        // ── Guest checkout ─────────────────────────────────────────────────
        const guestData = JSON.parse(sessionStorage.getItem("af_guest_checkout") || "{}");
        const order = await apiClient.post<{ order_id: string; order_number: string; total: number }>("/api/v1/guest/checkout", {
          guest_name: guestData.name || contactName || "Guest",
          guest_email: guestData.email || "",
          guest_phone: guestData.phone || shippingPhone || undefined,
          items: guestEntries.map(e => ({ variant_id: e.variant_id, quantity: e.quantity })),
          shipping_address: {
            label: "Shipping",
            full_name: guestData.name,
            line1: shippingAddress.line1,
            line2: shippingAddress.line2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.postal_code,
            country: shippingAddress.country || "US",
          },
          shipping_method: shippingMethod || "standard",
          payment_method: paymentMethod,
          qb_token: paymentMethod === "card" ? qbToken : undefined,
          ach_bank_name: paymentMethod === "ach" ? achBankName : undefined,
          ach_account_holder: paymentMethod === "ach" ? achAccountHolder : undefined,
          ach_routing_number: paymentMethod === "ach" ? achRoutingNumber : undefined,
          ach_account_last4: paymentMethod === "ach" ? achAccountLast4 : undefined,
          ach_account_type: paymentMethod === "ach" ? achAccountType : undefined,
          order_notes: orderNotes || undefined,
          tax_amount: taxAmount > 0 ? taxAmount : undefined,
          tax_rate: taxRate?.rate ?? undefined,
          tax_region: taxRate?.region ?? undefined,
          shipping_cost: shippingCost > 0 ? shippingCost : undefined,
        });

        const guestSubtotal = guestEntries.reduce((s, e) => s + e.unit_price * e.quantity, 0);
        const productName = guestEntries[0]?.product_name ?? "Your Order";
        const colorSummary = guestEntries.map(e => e.color ?? "").filter(Boolean).join(", ");

        const confirmedData = {
          id: order.order_id,
          number: order.order_number,
          total: order.total,
          units: guestEntries.reduce((s, e) => s + e.quantity, 0),
          colorSummary,
          productName,
          shippingMethod,
          shippingCost,
          paymentMethod,
          isGuest: true,
        };
        setConfirmedOrder(confirmedData);
        sessionStorage.setItem("af_confirmed_order", JSON.stringify(confirmedData));
        localStorage.removeItem("af_guest_cart");
        sessionStorage.removeItem("af_guest_checkout");
        window.dispatchEvent(new Event("af_guest_cart_updated"));
        router.push("/checkout/confirmed");
        return;
      }

      // ── Wholesale checkout ───────────────────────────────────────────────
      const fullAddress = {
        label: companyName || "Shipping",
        full_name: contactName || undefined,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postal_code,
        country: shippingAddress.country || "US",
        phone: shippingPhone || undefined,
      };

      const basePayload = {
        address_id: addressId ?? undefined,
        shipping_address: fullAddress,
        shipping_method: shippingMethod || "standard",
        po_number: poNumber || undefined,
        order_notes: orderNotes || undefined,
        discount_code: appliedCoupon?.code || undefined,
        tax_amount: taxAmount > 0 ? taxAmount : undefined,
        tax_rate: taxRate?.rate ?? undefined,
        tax_region: taxRate?.region ?? undefined,
        shipping_cost: shippingCost > 0 ? shippingCost : undefined,
      };

      const order = await ordersService.confirmOrder(
        paymentMethod === "ach"
          ? {
              ...basePayload,
              payment_method: "ach",
              ach_bank_name: achBankName || undefined,
              ach_account_holder: achAccountHolder || undefined,
              ach_routing_number: achRoutingNumber || undefined,
              ach_account_last4: achAccountLast4 || undefined,
              ach_account_type: achAccountType || undefined,
            }
          : {
              ...basePayload,
              qb_token: qbToken ?? undefined,
              saved_card_id: savedCardId ?? undefined,
            }
      );

      const productName = cart?.items[0]?.product_name ?? "Your Order";
      const colorSummary = cart ? buildColorSummary(cart) : "";
      const orderTotal = subtotal + shippingCost + taxAmount - couponDiscount;

      const confirmedData = {
        id: order.id,
        number: order.order_number,
        total: orderTotal,
        units: cart?.total_units ?? 0,
        colorSummary,
        productName,
        shippingMethod,
        shippingCost,
        paymentMethod,
      };
      setConfirmedOrder(confirmedData);
      sessionStorage.setItem("af_confirmed_order", JSON.stringify(confirmedData));

      if (typeof window !== "undefined") localStorage.removeItem("af_coupon");
      clearCart();
      window.dispatchEvent(new Event("cart_updated"));
      router.push("/checkout/confirmed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
      setIsPlacing(false);
    }
  }

  const selectedCard = savedCards.find(c => c.id === savedCardId);
  const paymentLabel = paymentMethod === "ach"
    ? `ACH / Bank Transfer${achAccountLast4 ? ` \u2014 ****${achAccountLast4}` : ""}`
    : selectedCard
    ? `${brandDisplayName(selectedCard.brand)} \u2022\u2022\u2022\u2022 ${selectedCard.last4}`
    : qbToken
    ? "New Card (tokenized)"
    : "Credit Card";

  // Priority: stored TaxJar amount → fresh re-fetch amount → rate × (subtotal+shipping-discount)
  const taxAmount = storedTaxAmount > 0
    ? storedTaxAmount
    : freshTaxAmount > 0
      ? freshTaxAmount
      : (taxRate ? Math.round(Math.max(0, subtotal - couponDiscount) * taxRate.rate / 100 * 100) / 100 : 0); // shipping not taxed
  const total = subtotal + shipping + taxAmount - (isGuest ? 0 : couponDiscount);
  const shippingLabel = SHIPPING_LABELS[shippingMethod] ?? "Standard Ground";

  const sectionCard: React.CSSProperties = {
    background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px",
    padding: "20px 24px", marginBottom: "14px",
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em",
    color: "#7A7880", marginBottom: "14px",
  };

  return (
    <div>
      {/* ── Heading ── */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(22px,4vw,32px)", color: "#2A2830", letterSpacing: ".03em", lineHeight: 1, marginBottom: "6px" }}>
          Review Your Order
        </h1>
        <p style={{ fontSize: "13px", color: "#7A7880" }}>
          Please confirm all details before placing your order.
        </p>
      </div>

      {/* ── Shipping ── */}
      <div style={sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={sectionLabel as React.CSSProperties}>Shipping Address</div>
          <button onClick={() => router.push("/checkout/address")} style={{ fontSize: "11px", color: "#1A5CFF", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Edit</button>
        </div>
        <div style={{ fontSize: "13px", color: "#2A2830", lineHeight: 1.7 }}>
          {companyName && <div style={{ fontWeight: 700 }}>{companyName}</div>}
          {contactName && <div>{contactName}</div>}
          {shippingAddress && (
            <>
              <div>{shippingAddress.line1}</div>
              {shippingAddress.line2 && <div>{shippingAddress.line2}</div>}
              <div>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</div>
            </>
          )}
          {shippingPhone && <div style={{ color: "#7A7880" }}>{shippingPhone}</div>}
        </div>
        <div style={{ borderTop: "1px solid #F0EEE9", margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
          <span style={{ color: "#7A7880" }}>Shipping Method</span>
          <span style={{ fontWeight: 700, color: "#2A2830" }}>
            {shippingLabel} — {shipping === 0 ? "FREE" : formatCurrency(shipping)}
          </span>
        </div>
      </div>

      {/* ── Payment ── */}
      <div style={sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={sectionLabel as React.CSSProperties}>Payment</div>
          <button onClick={() => router.push("/checkout/payment")} style={{ fontSize: "11px", color: "#1A5CFF", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Change</button>
        </div>
        {paymentMethod === "ach" ? (
          <div style={{ fontSize: "13px", color: "#2A2830", lineHeight: 1.8 }}>
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>ACH / Bank Transfer</div>
            {achBankName && <div style={{ color: "#7A7880" }}>Bank: <span style={{ color: "#2A2830", fontWeight: 600 }}>{achBankName}</span></div>}
            {achAccountHolder && <div style={{ color: "#7A7880" }}>Account Holder: <span style={{ color: "#2A2830", fontWeight: 600 }}>{achAccountHolder}</span></div>}
            {achAccountLast4 && <div style={{ color: "#7A7880" }}>Account: <span style={{ color: "#2A2830", fontWeight: 600 }}>****{achAccountLast4}</span></div>}
            {achAccountType && <div style={{ color: "#7A7880" }}>Type: <span style={{ color: "#2A2830", fontWeight: 600 }}>{achAccountType.charAt(0).toUpperCase() + achAccountType.slice(1)}</span></div>}
            <div style={{ marginTop: "8px", padding: "8px 12px", background: "rgba(217,119,6,.08)", borderRadius: "6px", fontSize: "12px", color: "#D97706", fontWeight: 600 }}>
              Order pending — payment verified within 1–2 business days
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
              <rect width="32" height="22" rx="3" fill="#F4F3EF" stroke="#E2E0DA" />
              <rect x="4" y="8" width="10" height="6" rx="1.5" fill="#E2E0DA" />
              <rect x="4" y="16" width="5" height="2" rx="0.5" fill="#E2E0DA" />
              <rect x="11" y="16" width="5" height="2" rx="0.5" fill="#E2E0DA" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#2A2830" }}>{paymentLabel}</span>
          </div>
        )}
      </div>

      {/* ── Order Items ── */}
      {(isGuest ? guestEntries.length > 0 : cart ? cart.items.length > 0 : false) && (
        <div style={sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={sectionLabel as React.CSSProperties}>Items in Your Order</div>
            <span style={{ fontSize: "11px", color: "#7A7880" }}>
              {isGuest
                ? `${guestEntries.reduce((s, e) => s + e.quantity, 0)} units`
                : `${cart!.total_units} units`}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {isGuest
              ? guestEntries.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "38px", height: "38px", flexShrink: 0, borderRadius: "6px", background: "#F4F3EF", border: "1px solid #E2E0DA", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                      {item.image_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={item.image_url} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                        : <span>👕</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2A2830" }}>{item.product_name}</div>
                      <div style={{ fontSize: "11px", color: "#7A7880", marginTop: "1px" }}>
                        {[item.color, item.size].filter(Boolean).join(" / ")}
                        {" · "}qty {item.quantity}
                      </div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#2A2830", whiteSpace: "nowrap" }}>{formatCurrency(item.unit_price * item.quantity)}</span>
                  </div>
                ))
              : cart!.items.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "38px", height: "38px", flexShrink: 0, borderRadius: "6px", background: "#F4F3EF", border: "1px solid #E2E0DA", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.product_image_url
                        ? <img src={item.product_image_url} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: "16px" }}>👕</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#2A2830" }}>{item.product_name}</div>
                      <div style={{ fontSize: "11px", color: "#7A7880", marginTop: "1px" }}>
                        {[item.color, item.size].filter(Boolean).join(" / ")}
                        {" · "}SKU {item.sku}
                        {" · "}qty {item.quantity}
                      </div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#2A2830", whiteSpace: "nowrap" }}>{formatCurrency(Number(item.line_total))}</span>
                  </div>
                ))
            }
          </div>
        </div>
      )}
      {/* Loading state for wholesale cart */}
      {!isGuest && !cart && (
        <div style={{ ...sectionCard, textAlign: "center", color: "#bbb", fontSize: "13px" }}>
          Loading order items…
        </div>
      )}

      {/* ── PO Number & Notes ── */}
      <div style={sectionCard}>
        <div style={sectionLabel as React.CSSProperties}>Order Details (Optional)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px" }}>
              PO Number
            </label>
            <input
              type="text"
              value={poNumber}
              onChange={e => setPoNumber(e.target.value)}
              placeholder="Optional purchase order reference"
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E0DA", borderRadius: "7px", fontSize: "13px", outline: "none", boxSizing: "border-box", color: "#2A2830" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px" }}>
              Order Notes
            </label>
            <textarea
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              placeholder="Special instructions or notes for this order"
              rows={3}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E0DA", borderRadius: "7px", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box", color: "#2A2830", fontFamily: "var(--font-jakarta)" }}
            />
          </div>
        </div>
      </div>

      {/* ── Order Total ── */}
      <div style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", padding: "18px 24px", marginBottom: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={row}>
            <span style={{ color: "#7A7880" }}>Subtotal ({isGuest ? guestEntries.reduce((s, e) => s + e.quantity, 0) : (cart?.total_units ?? 0)} units)</span>
            <span style={{ fontWeight: 600, color: "#2A2830" }}>{formatCurrency(subtotal)}</span>
          </div>
          {Number(cart?.discount_percent ?? 0) > 0 && (
            <div style={{ ...row, color: "#059669" }}>
              <span style={{ fontWeight: 600 }}>Tier Discount ({cart?.discount_percent}% applied)</span>
              <span style={{ fontWeight: 700 }}>&#10003; Included</span>
            </div>
          )}
          {appliedCoupon && (
            <div style={{ ...row, color: "#059669" }}>
              <span style={{ fontWeight: 600 }}>Coupon ({appliedCoupon.code})</span>
              <span style={{ fontWeight: 700 }}>-{formatCurrency(couponDiscount)}</span>
            </div>
          )}
          <div style={row}>
            <span style={{ color: "#7A7880" }}>Shipping ({shippingLabel})</span>
            <span style={{ color: shipping === 0 ? "#059669" : "#2A2830", fontWeight: 600 }}>
              {shipping === 0 ? "FREE" : formatCurrency(shipping)}
            </span>
          </div>
          <div style={row}>
            <span style={{ color: "#7A7880" }}>
              {taxRate ? `Tax (${taxRate.region} ${taxRate.rate}%)` : "Tax"}
            </span>
            <span style={{ color: "#2A2830", fontWeight: 600 }}>
              {formatCurrency(taxAmount)}
            </span>
          </div>
          <div style={{ borderTop: "1.5px solid #E2E0DA", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#2A2830" }}>Total</span>
            <span style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#E8242A", letterSpacing: ".02em" }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", background: "rgba(232,36,42,.07)", border: "1.5px solid rgba(232,36,42,.25)", color: "#E8242A", fontSize: "13px", fontWeight: 600, marginBottom: "14px" }}>
          {error}
        </div>
      )}

      {/* ── Place Order ── */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={() => router.push("/checkout/payment")}
          style={{ flex: 1, padding: "14px", border: "1.5px solid #E2E0DA", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#7A7880" }}
        >
          &#8592; Back
        </button>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          style={{
            flex: 3, padding: "14px",
            background: isPlacing ? "#E2E0DA" : "#E8242A",
            color: isPlacing ? "#aaa" : "#fff",
            border: "none", borderRadius: "8px",
            fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".08em",
            cursor: isPlacing ? "not-allowed" : "pointer", transition: "background .2s",
          }}
        >
          {isPlacing ? "Placing Order\u2026" : "Place Order"}
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: "11px", color: "#aaa", marginTop: "12px" }}>
        By placing your order you agree to our Terms of Service and wholesale pricing agreement.
      </p>
    </div>
  );
}
