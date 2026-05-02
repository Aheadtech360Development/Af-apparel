"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";

const DEPARTMENTS = [
  { value: "sales", label: "Sales & Pricing" },
  { value: "support", label: "Order Support" },
  { value: "private-label", label: "Private Label" },
  { value: "shipping", label: "Shipping & Logistics" },
  { value: "accounting", label: "Billing & Accounts" },
  { value: "other", label: "Other" },
];

const infoCards = [
  { icon: "📍", title: "Warehouse", lines: ["4050 Buckingham Rd,", "Dallas, TX 75247"] },
  { icon: "📞", title: "Phone", lines: ["(214) 272-7213", "Mon–Fri, 8 AM – 5 PM CST"] },
  { icon: "✉️", title: "Email", lines: ["info@afblanks.com", "We reply within 1 business day"] },
  { icon: "🕐", title: "Order Cutoff", lines: ["3:00 PM CST", "Same-day processing"] },
];

const faqs = [
  { q: "How do I apply for a wholesale account?", a: "Click 'Apply for Wholesale' in the navigation. Approval typically takes 1–2 business days." },
  { q: "What are your payment terms?", a: "We accept Visa, Mastercard, Amex, ACH, and wire transfer. Qualified accounts may apply for NET 30 terms." },
  { q: "Do you have a minimum order requirement?", a: "No minimums on in-stock items. Private label orders start at 2,500 units per style/color." },
  { q: "What is your return policy?", a: "Non-defective returns are accepted within 30 days with a 15% restocking fee. Defective merchandise is replaced at no charge." },
];

const inp: React.CSSProperties = {
  width: "100%", padding: "11px 14px", border: "1.5px solid #E2E0DA",
  borderRadius: "8px", fontSize: "14px", outline: "none", background: "#fff",
  fontFamily: "inherit", boxSizing: "border-box" as const,
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", department: "sales", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await apiClient.post("/api/v1/contact", form);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{ background: "#F4F3EF", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#2A2830", color: "#fff", padding: "60px 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px, 6vw, 64px)", letterSpacing: ".04em", marginBottom: "10px" }}>Get in Touch</h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.65)", maxWidth: "500px", lineHeight: 1.7 }}>
            Our team is available Monday–Friday, 8 AM – 5 PM CST. Most inquiries are answered within 1 business day.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "52px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "40px", alignItems: "start" }}>

          {/* Contact Form */}
          <div style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "14px", padding: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "24px" }}>Send a Message</h2>

            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "8px" }}>Message Sent!</h3>
                <p style={{ fontSize: "14px", color: "#7A7880" }}>We&apos;ll get back to you within 1 business day.</p>
                <button onClick={() => { setForm({ name: "", email: "", phone: "", company: "", department: "sales", message: "" }); setStatus("idle"); }} style={{ marginTop: "20px", background: "#1A5CFF", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".05em" }}>Full Name *</label>
                    <input style={inp} value={form.name} onChange={e => set("name", e.target.value)} required placeholder="John Smith" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".05em" }}>Company</label>
                    <input style={inp} value={form.company} onChange={e => set("company", e.target.value)} placeholder="Your Company" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".05em" }}>Email *</label>
                    <input type="email" style={inp} value={form.email} onChange={e => set("email", e.target.value)} required placeholder="john@company.com" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".05em" }}>Phone</label>
                    <input type="tel" style={inp} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".05em" }}>Department</label>
                  <select style={{ ...inp }} value={form.department} onChange={e => set("department", e.target.value)}>
                    {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".05em" }}>Message *</label>
                  <textarea rows={5} style={{ ...inp, resize: "vertical" }} value={form.message} onChange={e => set("message", e.target.value)} required placeholder="Tell us how we can help…" />
                </div>
                {status === "error" && (
                  <p style={{ fontSize: "13px", color: "#E8242A" }}>Failed to send. Please try again or email us directly at info@afblanks.com.</p>
                )}
                <button type="submit" disabled={status === "sending"} style={{ background: "#E8242A", color: "#fff", border: "none", borderRadius: "8px", padding: "13px 24px", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: status === "sending" ? 0.7 : 1, textTransform: "uppercase", letterSpacing: ".06em" }}>
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info Cards + FAQ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {infoCards.map(c => (
              <div key={c.title} style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "10px", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px", flexShrink: 0, marginTop: "2px" }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#2A2830", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "4px" }}>{c.title}</div>
                  {c.lines.map(l => <div key={l} style={{ fontSize: "13px", color: "#555" }}>{l}</div>)}
                </div>
              </div>
            ))}

            {/* Hours */}
            <div style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "10px", padding: "18px 20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#2A2830", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "12px" }}>🕐 Business Hours</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <tbody>
                  {[["Mon – Fri", "8:00 AM – 5:00 PM CST"], ["Saturday", "Closed"], ["Sunday", "Closed"]].map(([day, hrs]) => (
                    <tr key={day}>
                      <td style={{ padding: "4px 0", color: "#7A7880", width: "50%" }}>{day}</td>
                      <td style={{ padding: "4px 0", fontWeight: 600, color: "#2A2830" }}>{hrs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "34px", letterSpacing: ".04em", color: "#2A2830", marginBottom: "20px" }}>Frequently Asked Questions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {faqs.map(f => (
              <div key={f.q} style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "10px", padding: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#2A2830", marginBottom: "8px" }}>{f.q}</div>
                <p style={{ fontSize: "13px", color: "#7A7880", lineHeight: 1.6 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
