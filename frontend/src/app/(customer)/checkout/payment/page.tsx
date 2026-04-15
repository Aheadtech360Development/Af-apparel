"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QBPaymentForm } from "@/components/checkout/QBPaymentForm";
import { useCheckoutStore } from "@/stores/checkout.store";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { apiClient } from "@/lib/api-client";
import { cartService } from "@/services/cart.service";
import { ordersService } from "@/services/orders.service";
import { formatCurrency } from "@/lib/utils";
import type { Cart } from "@/types/order.types";

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  name: string | null;
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
    addressId, shippingAddress, companyName, contactName, shippingPhone,
    shippingMethod, poNumber, orderNotes,
    qbToken, setQbToken, savedCardId, setSavedCardId,
    setConfirmedOrder, reset,
  } = useCheckoutStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const { isAuthenticated, isLoading } = useAuthStore();

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved cards
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated()) return;

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
  }, [isLoading, isAuthenticated]);

  // Load cart for total display
  useEffect(() => {
    cartService.getCart().then(setCart).catch(() => {});
  }, []);

  // Build color summary from cart for the confirmation page
  function buildColorSummary(c: Cart): string {
    const colorMap = new Map<string, number>();
    for (const item of c.items) {
      const col = item.color ?? "Default";
      colorMap.set(col, (colorMap.get(col) ?? 0) + item.quantity);
    }
    return Array.from(colorMap.entries())
      .map(([color, units]) => `${color} × ${units} units`)
      .join(" + ");
  }

  async function handlePlaceOrder(tokenOrCardId: { type: "token"; token: string } | { type: "savedCard"; cardId: string }) {
    setIsPlacing(true);
    setError(null);

    // Build shipping address payload
    const fullAddress = shippingAddress
      ? {
          label: companyName || "Shipping",
          full_name: contactName || undefined,
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country || "US",
          phone: shippingPhone || undefined,
        }
      : undefined;

    try {
      const order = await ordersService.confirmOrder({
        qb_token: tokenOrCardId.type === "token" ? tokenOrCardId.token : undefined,
        saved_card_id: tokenOrCardId.type === "savedCard" ? tokenOrCardId.cardId : undefined,
        address_id: addressId ? (addressId as string) : undefined,
        shipping_address: fullAddress,
        po_number: poNumber || undefined,
        order_notes: orderNotes || undefined,
      });

      // Store confirmed order data for Step 3
      const productName = cart?.items[0]?.product_name ?? "Your Order";
      const colorSummary = cart ? buildColorSummary(cart) : "";
      const subtotal = Number(cart?.subtotal ?? 0);
      const shipping = Number(cart?.validation?.estimated_shipping ?? 0);
      const total = subtotal + shipping;

      setConfirmedOrder({
        id: order.id,
        number: order.order_number,
        total,
        units: cart?.total_units ?? 0,
        colorSummary,
        productName,
        shippingMethod,
      });

      clearCart();
      reset();
      router.push("/checkout/review");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
      setIsPlacing(false);
    }
  }

  function handleNewCardToken(token: string) {
    setQbToken(token);
    handlePlaceOrder({ type: "token", token });
  }

  function handleUseSavedCard() {
    if (!selectedCardId) return;
    setSavedCardId(selectedCardId);
    handlePlaceOrder({ type: "savedCard", cardId: selectedCardId });
  }

  if (loadingCards) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa", fontSize: "14px" }}>
        Loading payment methods…
      </div>
    );
  }

  const subtotal = Number(cart?.subtotal ?? 0);
  const shipping = Number(cart?.validation?.estimated_shipping ?? 0);
  const total = subtotal + shipping;

  return (
    <div>
      {/* ── Payment Method section ── */}
      <div style={sectionCard}>
        <span style={sectionTitle}>Payment Method</span>

        {savedCards.length > 0 && (
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

      {/* ── Order total summary ── */}
      {cart && (
        <div style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", padding: "18px 24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7880" }}>
              <span>Subtotal ({cart.total_units} units)</span>
              <span style={{ fontWeight: 600, color: "#2A2830" }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7880" }}>
              <span>Shipping</span>
              <span>{shipping > 0 ? formatCurrency(shipping) : "Calculated"}</span>
            </div>
            <div style={{ borderTop: "1px solid #F0EEE9", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 800, color: "#2A2830" }}>
              <span>Total</span>
              <span style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", letterSpacing: ".02em" }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", background: "rgba(232,36,42,.07)", border: "1.5px solid rgba(232,36,42,.25)", color: "#E8242A", fontSize: "13px", fontWeight: 600, marginBottom: "14px" }}>
          {error}
        </div>
      )}

      {/* ── Place Order (saved card) ── */}
      {!showNewCardForm && selectedCardId && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => router.push("/checkout/address")}
            style={{ flex: 1, padding: "14px", border: "1.5px solid #E2E0DA", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#7A7880" }}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleUseSavedCard}
            disabled={isPlacing}
            style={{
              flex: 2, padding: "14px", background: isPlacing ? "#E2E0DA" : "#E8242A",
              color: isPlacing ? "#aaa" : "#fff", border: "none", borderRadius: "8px",
              fontFamily: "var(--font-bebas)", fontSize: "17px", letterSpacing: ".08em",
              cursor: isPlacing ? "not-allowed" : "pointer", transition: "background .2s",
            }}
          >
            {isPlacing ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      )}

      {/* Back button when new card form is shown and no saved cards */}
      {showNewCardForm && savedCards.length === 0 && !isPlacing && (
        <button
          type="button"
          onClick={() => router.push("/checkout/address")}
          style={{ marginTop: "10px", padding: "12px 20px", border: "1.5px solid #E2E0DA", borderRadius: "8px", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#7A7880" }}
        >
          ← Back to Shipping
        </button>
      )}
    </div>
  );
}
