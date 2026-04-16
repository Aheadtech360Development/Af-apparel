"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useCheckoutStore, type ShippingMethod } from "@/stores/checkout.store";
import { cartService } from "@/services/cart.service";
import { formatCurrency } from "@/lib/utils";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

interface SavedAddress {
  id: string;
  label: string | null;
  full_name: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1.5px solid #E2E0DA",
  borderRadius: "7px", fontSize: "13px", fontFamily: "var(--font-jakarta)",
  outline: "none", boxSizing: "border-box", color: "#2A2830", background: "#fff",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700, color: "#7A7880",
  textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px",
};
const sectionCard: React.CSSProperties = {
  background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", padding: "22px 24px", marginBottom: "16px",
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-bebas)", fontSize: "17px", letterSpacing: ".06em",
  color: "#2A2830", marginBottom: "18px", display: "block",
};

const SHIPPING_OPTIONS: { id: ShippingMethod; label: string; sub: string; price: string; note?: string }[] = [
  { id: "standard", label: "Standard Ground", sub: "3–5 business days · Ships from Dallas, TX", price: "FREE", note: "Free shipping on orders over $500." },
  { id: "expedited", label: "Expedited (2-Day)", sub: "2 business days — guaranteed delivery", price: "$45.00" },
  { id: "freight", label: "Freight / LTL", sub: "For pallet-size orders — quote provided after checkout", price: "Quoted" },
];

export default function CheckoutAddressPage() {
  const router = useRouter();
  const {
    companyName, setCompanyName,
    contactName, setContactName,
    shippingPhone, setShippingPhone,
    shippingAddress, setShippingAddress,
    setAddressId,
    shippingMethod, setShippingMethod,
  } = useCheckoutStore();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  const [form, setForm] = useState({
    company: companyName || "",
    contact: contactName || "",
    street: shippingAddress?.line1 || "",
    city: shippingAddress?.city || "",
    state: shippingAddress?.state || "",
    zip: shippingAddress?.postal_code || "",
    phone: shippingPhone || "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  // Load saved addresses + cart subtotal
  useEffect(() => {
    cartService.getCart().then(c => setSubtotal(Number(c.subtotal))).catch(() => {});
    apiClient.get<SavedAddress[]>("/api/v1/account/addresses").then(addrs => {
      setSavedAddresses(addrs);
      if (addrs.length > 0) {
        // Pre-select the default address (or first)
        const def = addrs.find(a => a.is_default) ?? addrs[0]!;
        setSelectedAddressId(def.id);
        setShowNewForm(false);
      } else {
        setShowNewForm(true);
      }
    }).catch(() => {
      setShowNewForm(true);
    });
  }, []);

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.company.trim()) e.company = "Required";
    if (!form.contact.trim()) e.contact = "Required";
    if (!form.street.trim()) e.street = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (!showNewForm && selectedAddressId) {
      // Use a saved address
      const addr = savedAddresses.find(a => a.id === selectedAddressId);
      if (!addr) return;
      setCompanyName(form.company || companyName);
      setContactName(addr.full_name || contactName);
      setShippingPhone(addr.phone || "");
      setShippingAddress({
        line1: addr.line1,
        line2: addr.line2 || undefined,
        city: addr.city,
        state: addr.state,
        postal_code: addr.postal_code,
        country: addr.country || "US",
      });
      setAddressId(selectedAddressId);
      router.push("/checkout/payment");
    } else {
      // Manual entry
      if (!validate()) return;
      setCompanyName(form.company);
      setContactName(form.contact);
      setShippingPhone(form.phone);
      setShippingAddress({
        line1: form.street,
        city: form.city,
        state: form.state,
        postal_code: form.zip,
        country: "US",
      });
      setAddressId(null);
      router.push("/checkout/payment");
    }
  }

  const qualifiesFreeship = subtotal >= 500;

  return (
    <div>
      {/* ── Shipping Address ── */}
      <div style={sectionCard}>
        <span style={sectionTitle}>Shipping Address</span>

        {/* Saved addresses */}
        {savedAddresses.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
            {savedAddresses.map(addr => {
              const isSelected = selectedAddressId === addr.id && !showNewForm;
              return (
                <label
                  key={addr.id}
                  onClick={() => { setSelectedAddressId(addr.id); setShowNewForm(false); }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "14px",
                    padding: "14px 18px", borderRadius: "10px",
                    border: `1.5px solid ${isSelected ? "#E8242A" : "#E2E0DA"}`,
                    background: isSelected ? "rgba(232,36,42,.03)" : "#FAFAF8",
                    cursor: "pointer", transition: "all .15s",
                  }}
                >
                  {/* Radio */}
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                    border: `2px solid ${isSelected ? "#E8242A" : "#E2E0DA"}`,
                    background: isSelected ? "#E8242A" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isSelected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {/* Address text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#2A2830" }}>
                        {addr.label || "Address"}
                      </span>
                      {addr.is_default && (
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "3px", background: "rgba(232,36,42,.1)", color: "#E8242A" }}>
                          Default
                        </span>
                      )}
                    </div>
                    {addr.full_name && <div style={{ fontSize: "12px", color: "#7A7880" }}>{addr.full_name}</div>}
                    <div style={{ fontSize: "12px", color: "#7A7880" }}>
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.postal_code}
                    </div>
                    {addr.phone && <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{addr.phone}</div>}
                  </div>
                </label>
              );
            })}

            {/* Use a different address */}
            <label
              onClick={() => { setShowNewForm(true); setSelectedAddressId(null); }}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "12px 18px", borderRadius: "10px",
                border: `1.5px solid ${showNewForm ? "#E8242A" : "#E2E0DA"}`,
                background: showNewForm ? "rgba(232,36,42,.03)" : "#FAFAF8",
                cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#2A2830",
                transition: "all .15s",
              }}
            >
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${showNewForm ? "#E8242A" : "#E2E0DA"}`,
                background: showNewForm ? "#E8242A" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {showNewForm && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
              </div>
              + Use a different address
            </label>
          </div>
        )}

        {/* Company name always shown (needed for order label) */}
        <div style={{ marginBottom: "14px" }}>
          <label style={lbl}>Company Name <span style={{ color: "#E8242A" }}>*</span></label>
          <input
            style={{ ...inp, borderColor: errors.company ? "#E8242A" : "#E2E0DA" }}
            value={form.company}
            onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
            placeholder="AF Apparels Inc."
          />
          {errors.company && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{errors.company}</p>}
        </div>

        {/* Manual address form — shown when no saved addresses or "different address" selected */}
        {showNewForm && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Contact Name <span style={{ color: "#E8242A" }}>*</span></label>
              <input
                style={{ ...inp, borderColor: errors.contact ? "#E8242A" : "#E2E0DA" }}
                value={form.contact}
                onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                placeholder="John Smith"
              />
              {errors.contact && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{errors.contact}</p>}
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Street Address <span style={{ color: "#E8242A" }}>*</span></label>
              <input
                style={{ ...inp, borderColor: errors.street ? "#E8242A" : "#E2E0DA" }}
                value={form.street}
                onChange={e => setForm(p => ({ ...p, street: e.target.value }))}
                placeholder="123 Commerce Blvd, Suite 400"
              />
              {errors.street && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{errors.street}</p>}
            </div>

            <div>
              <label style={lbl}>City <span style={{ color: "#E8242A" }}>*</span></label>
              <input
                style={{ ...inp, borderColor: errors.city ? "#E8242A" : "#E2E0DA" }}
                value={form.city}
                onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                placeholder="Dallas"
              />
              {errors.city && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{errors.city}</p>}
            </div>

            <div>
              <label style={lbl}>State <span style={{ color: "#E8242A" }}>*</span></label>
              <select
                style={{ ...inp, cursor: "pointer", borderColor: errors.state ? "#E8242A" : "#E2E0DA" }}
                value={form.state}
                onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
              >
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{errors.state}</p>}
            </div>

            <div>
              <label style={lbl}>ZIP Code <span style={{ color: "#E8242A" }}>*</span></label>
              <input
                style={{ ...inp, borderColor: errors.zip ? "#E8242A" : "#E2E0DA" }}
                value={form.zip}
                onChange={e => setForm(p => ({ ...p, zip: e.target.value }))}
                placeholder="75001"
                maxLength={10}
              />
              {errors.zip && <p style={{ fontSize: "11px", color: "#E8242A", marginTop: "3px" }}>{errors.zip}</p>}
            </div>

            <div>
              <label style={lbl}>Phone <span style={{ fontSize: "10px", color: "#aaa", textTransform: "none", letterSpacing: 0 }}>(for shipping updates)</span></label>
              <input
                style={inp}
                type="tel"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="(214) 555-0100"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Shipping Method ── */}
      <div style={sectionCard}>
        <span style={sectionTitle}>Shipping Method</span>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SHIPPING_OPTIONS.map(opt => {
            const isSelected = shippingMethod === opt.id;
            const priceDisplay = opt.id === "standard"
              ? (qualifiesFreeship ? "FREE" : subtotal > 0 ? "FREE on $500+" : "FREE")
              : opt.price;

            return (
              <label
                key={opt.id}
                onClick={() => setShippingMethod(opt.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "14px",
                  padding: "16px 18px", borderRadius: "10px",
                  border: `1.5px solid ${isSelected ? "#E8242A" : "#E2E0DA"}`,
                  background: isSelected ? "rgba(232,36,42,.03)" : "#FAFAF8",
                  cursor: "pointer", transition: "border-color .15s, background .15s",
                }}
              >
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
                  border: `2px solid ${isSelected ? "#E8242A" : "#E2E0DA"}`,
                  background: isSelected ? "#E8242A" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isSelected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#2A2830" }}>{opt.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: priceDisplay === "FREE" ? "#059669" : "#2A2830" }}>
                      {priceDisplay}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#7A7880", marginTop: "3px" }}>{opt.sub}</div>
                  {opt.note && (
                    <div style={{ fontSize: "11px", color: qualifiesFreeship ? "#059669" : "#7A7880", marginTop: "4px", fontWeight: qualifiesFreeship ? 600 : 400 }}>
                      {opt.note}{qualifiesFreeship ? " Your order qualifies." : ""}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        style={{
          width: "100%", padding: "15px", background: "#E8242A", color: "#fff",
          border: "none", borderRadius: "8px", fontFamily: "var(--font-bebas)",
          fontSize: "17px", letterSpacing: ".08em", cursor: "pointer",
          transition: "background .2s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#c91e23"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E8242A"; }}
      >
        Continue to Payment
      </button>
    </div>
  );
}
