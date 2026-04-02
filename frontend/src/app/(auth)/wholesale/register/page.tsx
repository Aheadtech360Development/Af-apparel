"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService, type RegisterWholesalePayload } from "@/services/auth.service";
import { ApiClientError } from "@/lib/api-client";

const BUSINESS_TYPES = [
  "Retailer",
  "Distributor",
  "Reseller",
  "Online Store",
  "Brick & Mortar",
  "Boutique",
  "Department Store",
  "Other",
];

const VOLUME_OPTIONS = [
  "Less than $5,000/month",
  "$5,000 - $15,000/month",
  "$15,000 - $50,000/month",
  "$50,000 - $100,000/month",
  "Over $100,000/month",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E2E0DA",
  borderRadius: "6px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#2A2830",
  background: "#fff",
  outline: "none",
  transition: "border-color .2s",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".07em",
  color: "#7A7880",
  marginBottom: "6px",
};

export default function WholesaleRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<RegisterWholesalePayload>({
    company_name: "",
    tax_id: "",
    business_type: "",
    website: "",
    expected_monthly_volume: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authService.registerWholesale(form);
      router.push("/wholesale/pending");
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.code === "CONFLICT") {
          setError("An account with this email already exists. Please log in.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F3EF", fontFamily: "var(--font-jakarta)" }}>
      {/* Page header */}
      <div style={{ background: "#080808", padding: "32px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}>
          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "30px", color: "#1A5CFF", lineHeight: 1 }}>A</span>
          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "30px", color: "#E8242A", lineHeight: 1 }}>F</span>
          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "12px", color: "#fff", letterSpacing: ".18em" }}>APPARELS</span>
        </Link>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,3vw,42px)", color: "#fff", letterSpacing: ".02em", lineHeight: 1, marginBottom: "8px" }}>
          Apply for Wholesale Access
        </h1>
        <p style={{ fontSize: "14px", color: "#555", maxWidth: "460px", margin: "0 auto" }}>
          Free to apply. Approved within 24 hours. No commitment required.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 32px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "flex-start" }} className="register-grid-responsive">

        {/* Form card */}
        <div style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "12px", padding: "40px" }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: "#FFF0F0", border: "1px solid #fcc", borderRadius: "6px", padding: "12px 16px", fontSize: "13px", color: "#c0392b", marginBottom: "24px" }}>
                {error}
              </div>
            )}

            {/* Business Information */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".06em", color: "#2A2830", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #E2E0DA" }}>
                Business Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="company_name" style={labelStyle}>
                    Company Name <span style={{ color: "#E8242A" }}>*</span>
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    required
                    value={form.company_name}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Your Company LLC"
                  />
                </div>

                <div>
                  <label htmlFor="business_type" style={labelStyle}>
                    Business Type <span style={{ color: "#E8242A" }}>*</span>
                  </label>
                  <select
                    id="business_type"
                    name="business_type"
                    required
                    value={form.business_type}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Select type…</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tax_id" style={labelStyle}>Tax ID / EIN</label>
                  <input
                    id="tax_id"
                    name="tax_id"
                    type="text"
                    value={form.tax_id}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="XX-XXXXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="website" style={labelStyle}>Website</label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="expected_monthly_volume" style={labelStyle}>
                    Expected Monthly Volume
                  </label>
                  <select
                    id="expected_monthly_volume"
                    name="expected_monthly_volume"
                    value={form.expected_monthly_volume}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Select range…</option>
                    {VOLUME_OPTIONS.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".06em", color: "#2A2830", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #E2E0DA" }}>
                Contact Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label htmlFor="first_name" style={labelStyle}>
                    First Name <span style={{ color: "#E8242A" }}>*</span>
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={form.first_name}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="last_name" style={labelStyle}>
                    Last Name <span style={{ color: "#E8242A" }}>*</span>
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={form.last_name}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="email" style={labelStyle}>
                    Email Address <span style={{ color: "#E8242A" }}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" style={labelStyle}>Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="(214) 000-0000"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="password" style={labelStyle}>
                    Password <span style={{ color: "#E8242A" }}>*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Min. 8 characters"
                  />
                  <p style={{ marginTop: "5px", fontSize: "12px", color: "#7A7880" }}>Minimum 8 characters</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                background: isSubmitting ? "#ccc" : "#E8242A",
                color: "#fff",
                padding: "14px",
                fontSize: "14px",
                fontWeight: 700,
                borderRadius: "6px",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "all .2s",
                letterSpacing: ".04em",
                textTransform: "uppercase",
              }}
            >
              {isSubmitting ? "Submitting Application…" : "Submit Wholesale Application →"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#7A7880", marginTop: "16px" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#1A5CFF", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Benefits sidebar */}
        <div style={{ background: "#111016", border: "1px solid rgba(255,255,255,.06)", borderRadius: "12px", padding: "32px", position: "sticky", top: "20px" }}>
          <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: ".06em", color: "#fff", marginBottom: "20px" }}>
            Why Apply?
          </h3>
          {[
            { icon: "🏭", h: "Factory-Direct Pricing", p: "No distributors. Pay factory price — better margins on every order." },
            { icon: "📦", h: "No Minimums", p: "Order 1 unit or 10,000. In-stock items ship same day from Dallas." },
            { icon: "⚡", h: "Same-Day Shipping", p: "Orders before 2 PM CT ship the same day. Dallas, TX warehouse." },
            { icon: "🎨", h: "Print-Optimized Blanks", p: "Every fabric tested for DTF, screen printing, and embroidery." },
            { icon: "💳", h: "NET 30 Terms Available", p: "Qualifying accounts can access NET 30 payment terms." },
            { icon: "🤝", h: "Dedicated Support", p: "Real account manager — not a ticket queue. Phone + email." },
          ].map(item => (
            <div key={item.h} style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "20px", minWidth: "28px" }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily: "var(--font-bebas)", fontSize: "13px", letterSpacing: ".04em", color: "#ccc", marginBottom: "3px" }}>{item.h}</div>
                <div style={{ fontSize: "12px", color: "#444", lineHeight: 1.55 }}>{item.p}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700, marginBottom: "10px" }}>Trusted by 2,000+ Businesses</div>
            <div style={{ fontSize: "12px", color: "#444", lineHeight: 1.6 }}>
              Printing companies, retailers, corporate buyers, and apparel brands across the US source direct from AF Apparels.
            </div>
          </div>

          <div style={{ marginTop: "20px", background: "rgba(26,92,255,.08)", border: "1px solid rgba(26,92,255,.15)", borderRadius: "8px", padding: "14px" }}>
            <div style={{ fontSize: "12px", color: "#6B9FFF", fontWeight: 600, marginBottom: "4px" }}>Questions?</div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              📞 (214) 272-7213<br />
              ✉️ wholesale@afapparels.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
