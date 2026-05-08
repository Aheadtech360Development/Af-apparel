// frontend/src/app/(customer)/checkout/payment/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QBPaymentForm } from "@/components/checkout/QBPaymentForm";
import { useCheckoutStore } from "@/stores/checkout.store";
import { useAuthStore } from "@/stores/auth.store";
import { apiClient } from "@/lib/api-client";
import { cartService } from "@/services/cart.service";
import { formatCurrency } from "@/lib/utils";
import type { Cart } from "@/types/order.types";

type GuestCartEntry = { unit_price: number; quantity: number; product_name?: string; color?: string | null; size?: string | null };

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  name: string | null;
  is_default: boolean;
}

interface SavedAch {
  bank_name: string;
  account_holder: string;
  routing_last4: string;
  account_last4: string;
  account_type: string;
}

function brandDisplayName(brand: string): string {
  const b = brand.toLowerCase();
  if (b === "visa") return "Visa";
  if (b === "mastercard") return "Mastercard";
  if (b === "amex" || b === "american express") return "Amex";
  if (b === "discover") return "Discover";
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}
const sectionCard: React.CSSProperties = {
  background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", padding: "22px 24px", marginBottom: "16px",
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-bebas)", fontSize: "17px", letterSpacing: ".06em",
  color: "#2A2830", marginBottom: "18px", display: "block",
};

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const {
    shippingAddress, shippingMethod, shippingCost, setSavedCardId, setQbToken,
    taxAmount: storedTaxAmount, taxRate: storedTaxRate, taxRegion: storedTaxRegion,
    setPaymentMethod, setAchInfo,
  } = useCheckoutStore();
  const { isAuthenticated, isLoading } = useAuthStore();
  const isGuest = !isLoading && !isAuthenticated();
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState<"card" | "ach">("card");

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [guestSubtotal, setGuestSubtotal] = useState(0);

  const [savedAch, setSavedAch] = useState<SavedAch | null>(null);
  const [useNewAch, setUseNewAch] = useState(false);
  const [achForm, setAchForm] = useState({ bankName: "", accountHolder: "", routingNumber: "", accountNumber: "", accountType: "checking" as "checking" | "savings" });
  const [achErrors, setAchErrors] = useState<Partial<Record<keyof typeof achForm, string>>>({});

  // Guard: must have shipping address
  useEffect(() => {
    if (!shippingAddress) {
      router.replace("/checkout/address");
    }
  }, [shippingAddress, router]);

  // For guests: load guest cart total; for authenticated: load saved cards
  useEffect(() => {
    if (isLoading) return;

    if (isGuest) {
      // Guests always use the new card form
      setShowNewCardForm(true);
      setLoadingCards(false);
      try {
        const entries: GuestCartEntry[] = JSON.parse(localStorage.getItem("af_guest_cart") || "[]");
        setGuestSubtotal(entries.reduce((s, i) => s + i.unit_price * i.quantity, 0));
      } catch { /* ignore */ }
      return;
    }

    apiClient
      .get<SavedCard[]>("/api/v1/account/payment-methods")
      .then((cards) => {
        setSavedCards(cards);
        if (cards.length > 0) {
          const def = cards.find(c => c.is_default) ?? cards[0]!;
          setSelectedCardId(def.id);
          setShowNewCardForm(false);
        } else {
          setShowNewCardForm(true);
        }
      })
      .catch(() => setShowNewCardForm(true))
      .finally(() => setLoadingCards(false));

    apiClient
      .get<SavedAch>("/api/v1/account/ach-method")
      .then(ach => {
        if (ach && ach.account_last4) {
          setSavedAch(ach);
          setUseNewAch(false);
        }
      })
      .catch(() => { /* no saved ACH */ });
  }, [isLoading, isGuest, isAuthenticated]);

  // Load cart for total display (wholesale only)
  useEffect(() => {
    if (!isGuest) {
      cartService.getCart().then(setCart).catch(() => { });
    }
    const saved = localStorage.getItem("af_coupon");
    if (saved) {
      try { setCouponDiscount(JSON.parse(saved).discount_amount ?? 0); } catch { }
    }
  }, [isGuest]);


  function handleContinueWithSavedCard() {
    if (!selectedCardId) return;
    setPaymentMethod("card");
    setSavedCardId(selectedCardId);
    router.push("/checkout/review");
  }

  function handleNewCardToken(token: string) {
    setPaymentMethod("card");
    setQbToken(token);
    router.push("/checkout/review");
  }

  function handleAchContinue() {
    if (savedAch && !useNewAch) {
      setPaymentMethod("ach");
      setAchInfo(savedAch.bank_name, savedAch.account_holder, savedAch.routing_last4, savedAch.account_last4, savedAch.account_type as "checking" | "savings");
      router.push("/checkout/review");
      return;
    }
    const errors: Partial<Record<keyof typeof achForm, string>> = {};
    if (!achForm.bankName.trim()) errors.bankName = "Required";
    if (!achForm.accountHolder.trim()) errors.accountHolder = "Required";
    if (!/^\d{9}$/.test(achForm.routingNumber.trim())) errors.routingNumber = "Must be exactly 9 digits";
    if (!achForm.accountNumber.trim()) errors.accountNumber = "Required";
    else if (achForm.accountNumber.replace(/\D/g, "").length < 4) errors.accountNumber = "Account number too short";
    if (Object.keys(errors).length > 0) { setAchErrors(errors); return; }
    const last4 = achForm.accountNumber.replace(/\D/g, "").slice(-4);
    setPaymentMethod("ach");
    setAchInfo(achForm.bankName.trim(), achForm.accountHolder.trim(), achForm.routingNumber.trim(), last4, achForm.accountType);
    router.push("/checkout/review");
  }

  if (loadingCards) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa", fontSize: "14px" }}>
        Loading payment methods…
      </div>
    );
  }

  const subtotal = isGuest ? guestSubtotal : Number(cart?.subtotal ?? 0);
  const shipping = shippingCost;
  const taxAmountDisplay = storedTaxAmount > 0 ? storedTaxAmount : 0;
  const total = subtotal + shipping + taxAmountDisplay - (isGuest ? 0 : couponDiscount);

  const SHIPPING_LABELS: Record<string, string> = {
    standard: "Standard Ground",
    expedited: "Expedited (2-Day)",
    will_call: "Will Call Pickup",
  };

  const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1.5px solid #E2E0DA", borderRadius: "7px", fontSize: "13px", fontFamily: "var(--font-jakarta)", outline: "none", boxSizing: "border-box", color: "#2A2830", background: "#fff" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 700, color: "#7A7880", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px" };

  return (
    <div>
      {/* ── Payment Method type selector ── */}
      <div style={sectionCard}>
        <span style={sectionTitle}>Payment Method</span>
        <div style={{ display: "flex", gap: "10px" }}>
          {(["card", "ach"] as const).map(type => {
            const isSelected = paymentType === type;
            return (
              <label key={type} onClick={() => setPaymentType(type)} style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", borderRadius: "10px", border: `1.5px solid ${isSelected ? "#1A5CFF" : "#E2E0DA"}`, background: isSelected ? "rgba(26,92,255,.04)" : "#FAFAF8", cursor: "pointer", transition: "all .15s" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, border: `2px solid ${isSelected ? "#1A5CFF" : "#E2E0DA"}`, background: isSelected ? "#1A5CFF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isSelected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#2A2830" }}>{type === "card" ? "Credit / Debit Card" : "ACH / Bank Transfer"}</div>
                  <div style={{ fontSize: "11px", color: "#7A7880", marginTop: "2px" }}>{type === "card" ? "Visa, Mastercard, Amex, Discover" : "Checking or savings account"}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── ACH section ── */}
      {paymentType === "ach" && (
        <div style={sectionCard}>
          <span style={sectionTitle}>Bank Account Details</span>

          {/* Saved ACH — shown for authenticated users who have one saved */}
          {!isGuest && savedAch && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: useNewAch ? "16px" : "0" }}>
              {/* Saved ACH option */}
              <label
                onClick={() => setUseNewAch(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "14px 18px", borderRadius: "10px",
                  border: `1.5px solid ${!useNewAch ? "#1A5CFF" : "#E2E0DA"}`,
                  background: !useNewAch ? "rgba(26,92,255,.04)" : "#FAFAF8",
                  cursor: "pointer", transition: "all .15s",
                }}
              >
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${!useNewAch ? "#1A5CFF" : "#E2E0DA"}`,
                  background: !useNewAch ? "#1A5CFF" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {!useNewAch && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
                </div>
                {/* Bank icon */}
                <svg width="32" height="22" viewBox="0 0 32 22" fill="none" style={{ flexShrink: 0 }}>
                  <rect width="32" height="22" rx="3" fill="#F4F3EF" stroke="#E2E0DA" />
                  <rect x="4" y="5" width="24" height="3" rx="1" fill="#E2E0DA" />
                  <rect x="6" y="10" width="3" height="6" rx="0.5" fill="#E2E0DA" />
                  <rect x="14" y="10" width="3" height="6" rx="0.5" fill="#E2E0DA" />
                  <rect x="22" y="10" width="3" height="6" rx="0.5" fill="#E2E0DA" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#2A2830" }}>
                    {savedAch.bank_name} •••• {savedAch.account_last4}
                  </div>
                  <div style={{ fontSize: "11px", color: "#7A7880", marginTop: "2px" }}>
                    {savedAch.account_holder} · {savedAch.account_type.charAt(0).toUpperCase() + savedAch.account_type.slice(1)}
                  </div>
                </div>
              </label>

              {/* Use different account option */}
              <label
                onClick={() => setUseNewAch(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "12px 18px", borderRadius: "10px",
                  border: `1.5px solid ${useNewAch ? "#1A5CFF" : "#E2E0DA"}`,
                  background: useNewAch ? "rgba(26,92,255,.04)" : "#FAFAF8",
                  cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#2A2830",
                  transition: "all .15s",
                }}
              >
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${useNewAch ? "#1A5CFF" : "#E2E0DA"}`,
                  background: useNewAch ? "#1A5CFF" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {useNewAch && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
                </div>
                + Use a different account
              </label>
            </div>
          )}

          {/* Manual ACH form — shown when no saved ACH, or user chose "use different account" */}
          {(isGuest || !savedAch || useNewAch) && (
            <div style={{ borderTop: savedAch && useNewAch ? "1px solid #F0EEE9" : "none", paddingTop: savedAch && useNewAch ? "16px" : "0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={lbl}>Bank Name <span style={{ color: "#E8242A" }}>*</span></label>
                  <input style={{ ...inp, borderColor: achErrors.bankName ? "#E8242A" : "#E2E0DA" }} value={achForm.bankName} onChange={e => { setAchForm(p => ({ ...p, bankName: e.target.value })); setAchErrors(p => ({ ...p, bankName: undefined })); }} placeholder="Chase, Wells Fargo, etc." />
                  {achErrors.bankName && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{achErrors.bankName}</p>}
                </div>
                <div>
                  <label style={lbl}>Account Holder Name <span style={{ color: "#E8242A" }}>*</span></label>
                  <input style={{ ...inp, borderColor: achErrors.accountHolder ? "#E8242A" : "#E2E0DA" }} value={achForm.accountHolder} onChange={e => { setAchForm(p => ({ ...p, accountHolder: e.target.value })); setAchErrors(p => ({ ...p, accountHolder: undefined })); }} placeholder="Full name on account" />
                  {achErrors.accountHolder && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{achErrors.accountHolder}</p>}
                </div>
                <div>
                  <label style={lbl}>Routing Number <span style={{ color: "#E8242A" }}>*</span></label>
                  <input style={{ ...inp, borderColor: achErrors.routingNumber ? "#E8242A" : "#E2E0DA" }} value={achForm.routingNumber} onChange={e => { setAchForm(p => ({ ...p, routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9) })); setAchErrors(p => ({ ...p, routingNumber: undefined })); }} placeholder="9-digit routing number" maxLength={9} />
                  {achErrors.routingNumber && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{achErrors.routingNumber}</p>}
                </div>
                <div>
                  <label style={lbl}>Account Number <span style={{ color: "#E8242A" }}>*</span></label>
                  <input style={{ ...inp, borderColor: achErrors.accountNumber ? "#E8242A" : "#E2E0DA" }} value={achForm.accountNumber} onChange={e => { setAchForm(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, "") })); setAchErrors(p => ({ ...p, accountNumber: undefined })); }} placeholder="Account number" type="text" />
                  {achErrors.accountNumber && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{achErrors.accountNumber}</p>}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Account Type <span style={{ color: "#E8242A" }}>*</span></label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {(["checking", "savings"] as const).map(t => (
                      <label key={t} onClick={() => setAchForm(p => ({ ...p, accountType: t }))} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "8px", border: `1.5px solid ${achForm.accountType === t ? "#1A5CFF" : "#E2E0DA"}`, cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#2A2830", background: achForm.accountType === t ? "rgba(26,92,255,.04)" : "#FAFAF8" }}>
                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${achForm.accountType === t ? "#1A5CFF" : "#E2E0DA"}`, background: achForm.accountType === t ? "#1A5CFF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {achForm.accountType === t && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />}
                        </div>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: "14px", padding: "12px 14px", background: "#F4F3EF", borderRadius: "8px", fontSize: "12px", color: "#7A7880", lineHeight: 1.6 }}>
            ACH payments are verified manually. Your order will be processed within 1–2 business days after payment is confirmed.
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button type="button" onClick={() => router.push("/checkout/address")} style={{ flex: 1, padding: "14px", border: "1.5px solid #E2E0DA", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#7A7880" }}>
              &#8592; Back
            </button>
            <button type="button" onClick={handleAchContinue} style={{ flex: 2, padding: "14px", background: "#E8242A", color: "#fff", border: "none", borderRadius: "8px", fontFamily: "var(--font-bebas)", fontSize: "17px", letterSpacing: ".08em", cursor: "pointer" }}>
              Continue to Review &#8594;
            </button>
          </div>
        </div>
      )}

      {/* ── Card payment section (when card type selected) ── */}
      {paymentType === "card" && (
      <div style={sectionCard}>
        {!isGuest && <span style={sectionTitle}>Card Details</span>}

        {savedCards.length > 0 && !isGuest && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: showNewCardForm ? "16px" : "0" }}>
            {savedCards.map(card => {
              const isSelected = selectedCardId === card.id && !showNewCardForm;
              return (
                <label
                  key={card.id}
                  onClick={() => { setSelectedCardId(card.id); setShowNewCardForm(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "14px 18px", borderRadius: "10px",
                    border: `1.5px solid ${isSelected ? "#1A5CFF" : "#E2E0DA"}`,
                    background: isSelected ? "rgba(26,92,255,.04)" : "#FAFAF8",
                    cursor: "pointer", transition: "all .15s",
                  }}
                >
                  {/* Radio */}
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${isSelected ? "#1A5CFF" : "#E2E0DA"}`,
                    background: isSelected ? "#1A5CFF" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isSelected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {/* Card icon */}
                  <svg width="32" height="22" viewBox="0 0 32 22" fill="none" style={{ flexShrink: 0 }}>
                    <rect width="32" height="22" rx="3" fill="#F4F3EF" stroke="#E2E0DA" />
                    <rect x="4" y="8" width="10" height="6" rx="1.5" fill="#E2E0DA" />
                    <rect x="4" y="16" width="5" height="2" rx="0.5" fill="#E2E0DA" />
                    <rect x="11" y="16" width="5" height="2" rx="0.5" fill="#E2E0DA" />
                  </svg>
                  {/* Card info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#2A2830" }}>
                      {brandDisplayName(card.brand)} •••• {card.last4}
                      {card.is_default && (
                        <span style={{ marginLeft: "8px", fontSize: "10px", background: "rgba(26,92,255,.1)", color: "#1A5CFF", padding: "2px 7px", borderRadius: "3px", fontWeight: 700 }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "11px", color: "#7A7880", marginTop: "2px" }}>
                      Expires {card.exp_month}/{card.exp_year}
                    </div>
                  </div>
                </label>
              );
            })}

            {/* Use new card option */}
            <label
              onClick={() => { setShowNewCardForm(true); setSelectedCardId(null); }}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "12px 18px", borderRadius: "10px",
                border: `1.5px solid ${showNewCardForm ? "#1A5CFF" : "#E2E0DA"}`,
                background: showNewCardForm ? "rgba(26,92,255,.04)" : "#FAFAF8",
                cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#2A2830",
                transition: "all .15s",
              }}
            >
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${showNewCardForm ? "#1A5CFF" : "#E2E0DA"}`,
                background: showNewCardForm ? "#1A5CFF" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {showNewCardForm && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
              </div>
              + Use a new card
            </label>
          </div>
        )}

        {/* New card form */}
        {showNewCardForm && (
          <div style={{ borderTop: savedCards.length > 0 ? "1px solid #F0EEE9" : "none", paddingTop: savedCards.length > 0 ? "16px" : "0" }}>
            <QBPaymentForm
              onToken={handleNewCardToken}
              onBack={
                savedCards.length > 0
                  ? () => { setShowNewCardForm(false); setSelectedCardId(savedCards.find(c => c.is_default)?.id ?? savedCards[0]?.id ?? null); }
                  : () => router.push("/checkout/address")
              }
            />
          </div>
        )}
      </div>
      )}

      {/* ── Order total summary ── */}
      {cart && paymentType === "card" && (
        <div style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", padding: "18px 24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7880" }}>
              <span>Subtotal ({cart.total_units} units)</span>
              <span style={{ fontWeight: 600, color: "#2A2830" }}>{formatCurrency(subtotal)}</span>
            </div>
            {Number(cart.discount_percent) > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#059669" }}>
                <span style={{ fontWeight: 600 }}>Tier Discount ({cart.discount_percent}% applied)</span>
                <span style={{ fontWeight: 700 }}>&#10003; Included</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7880" }}>
              <span>Shipping ({SHIPPING_LABELS[shippingMethod] ?? "Standard"})</span>
              <span style={{ color: shipping === 0 ? "#059669" : "#2A2830", fontWeight: 600 }}>
                {shipping === 0 ? "FREE" : formatCurrency(shipping)}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#059669" }}>
                <span style={{ fontWeight: 600 }}>Coupon Applied</span>
                <span style={{ fontWeight: 700 }}>-{formatCurrency(couponDiscount)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7880" }}>
              <span>{storedTaxRegion && storedTaxRate > 0 ? `Tax (${storedTaxRegion} ${storedTaxRate}%)` : "Tax"}</span>
              <span style={{ fontWeight: 600, color: "#2A2830" }}>{formatCurrency(taxAmountDisplay)}</span>
            </div>
            <div style={{ borderTop: "1px solid #F0EEE9", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 800, color: "#2A2830" }}>
              <span>Total</span>
              <span style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", letterSpacing: ".02em" }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Continue to Review (saved card) ── */}
      {paymentType === "card" && !showNewCardForm && selectedCardId && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => router.push("/checkout/address")}
            style={{ flex: 1, padding: "14px", border: "1.5px solid #E2E0DA", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#7A7880" }}
          >
            &#8592; Back
          </button>
          <button
            type="button"
            onClick={handleContinueWithSavedCard}
            style={{
              flex: 2, padding: "14px", background: "#E8242A",
              color: "#fff", border: "none", borderRadius: "8px",
              fontFamily: "var(--font-bebas)", fontSize: "17px", letterSpacing: ".08em",
              cursor: "pointer", transition: "background .2s",
            }}
          >
            Continue to Review &#8594;
          </button>
        </div>
      )}

      {/* Back button when new card form shown and no saved cards */}
      {paymentType === "card" && showNewCardForm && savedCards.length === 0 && (
        <button
          type="button"
          onClick={() => router.push("/checkout/address")}
          style={{ marginTop: "10px", padding: "12px 20px", border: "1.5px solid #E2E0DA", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#7A7880" }}
        >
          &#8592; Back to Shipping
        </button>
      )}
    </div>
  );
}
