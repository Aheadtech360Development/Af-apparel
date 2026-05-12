"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle, Briefcase, Wrench, Tag, Check } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const DEPARTMENTS = [
  { value: "", label: "Select a department" },
  { value: "wholesale-sales", label: "Wholesale Sales — New Account Inquiry" },
  { value: "account-support", label: "Existing Account Support" },
  { value: "private-label", label: "Private Label Program" },
  { value: "order-status", label: "Order Status / Shipping" },
  { value: "returns", label: "Returns & Exchanges" },
  { value: "other", label: "Other" },
];

const inp: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB",
  borderRadius: "4px", fontSize: "13px", outline: "none", background: "#fff",
  fontFamily: "inherit", boxSizing: "border-box" as const,
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", department: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await apiClient.post("/api/v1/contact", {
        name: form.name,
        company: form.business,
        email: form.email,
        phone: form.phone,
        department: form.department,
        message: form.message,
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Announce */}
      <div style={{ background: "#E8242A", color: "#fff", textAlign: "center", padding: "7px 24px", fontSize: "12px", fontWeight: 600, letterSpacing: ".02em" }}>
        Factory-Direct Wholesale Blanks — (214) 272-7213 | info.afapparel@gmail.com
      </div>

      {/* Hero */}
      <div style={{ background: "#0a1628", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(45,140,255,.15)", color: "#2D8CFF", fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "4px", marginBottom: "12px", letterSpacing: ".04em" }}>
            <Phone size={13} style={{ flexShrink: 0 }} />
            We respond within 4 business hours
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(22px,3vw,34px)", color: "#fff", margin: "12px 0 8px", letterSpacing: ".04em" }}>
            Get in Touch With Our Team
          </h1>
          <p style={{ color: "#6B7280", fontSize: "13.5px", maxWidth: "520px", lineHeight: 1.7 }}>
            Whether you&apos;re ready to apply, have questions about a large order, or want to discuss private label — we&apos;re here. Real people, fast responses.
          </p>
        </div>
      </div>

      {/* Main Contact */}
      <div style={{ background: "#F7F8FA", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>

            {/* Form */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", letterSpacing: ".04em", color: "#111", marginBottom: "20px" }}>Send Us a Message</h3>

              {status === "sent" ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <CheckCircle size={48} style={{ marginBottom: "16px", color: "#059669" }} />
                  <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", color: "#111", marginBottom: "8px" }}>Message Sent!</h3>
                  <p style={{ fontSize: "13px", color: "#6B7280" }}>We&apos;ll respond within 4 business hours Mon–Fri.</p>
                  <button onClick={() => { setForm({ name: "", business: "", email: "", phone: "", department: "", message: "" }); setStatus("idle"); }} style={{ marginTop: "20px", background: "#E8242A", color: "#fff", border: "none", borderRadius: "3px", padding: "9px 20px", fontSize: "13px", fontFamily: "var(--font-bebas)", fontWeight: 700, cursor: "pointer", letterSpacing: ".04em" }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".06em" }}>Full Name <span style={{ color: "#E8242A" }}>*</span></label>
                      <input style={inp} value={form.name} onChange={e => set("name", e.target.value)} required placeholder="Your full name" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".06em" }}>Business Name <span style={{ color: "#E8242A" }}>*</span></label>
                      <input style={inp} value={form.business} onChange={e => set("business", e.target.value)} required placeholder="Company name" />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".06em" }}>Email Address <span style={{ color: "#E8242A" }}>*</span></label>
                      <input type="email" style={inp} value={form.email} onChange={e => set("email", e.target.value)} required placeholder="your@email.com" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".06em" }}>Phone Number</label>
                      <input type="tel" style={inp} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" />
                    </div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".06em" }}>Department <span style={{ color: "#E8242A" }}>*</span></label>
                    <select style={{ ...inp, cursor: "pointer" }} value={form.department} onChange={e => set("department", e.target.value)} required>
                      {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".06em" }}>How Can We Help? <span style={{ color: "#E8242A" }}>*</span></label>
                    <textarea rows={5} style={{ ...inp, resize: "vertical" }} value={form.message} onChange={e => set("message", e.target.value)} required placeholder="Tell us about your business, order size, or question — the more detail the better." />
                  </div>
                  {status === "error" && (
                    <p style={{ fontSize: "12px", color: "#E8242A", marginBottom: "12px" }}>Failed to send. Please try again or email us directly at info.afapparel@gmail.com.</p>
                  )}
                  <button type="submit" disabled={status === "sending"} style={{ width: "100%", background: "#E8242A", color: "#fff", border: "none", borderRadius: "3px", padding: "13px", fontSize: "14px", fontFamily: "var(--font-bebas)", fontWeight: 700, cursor: "pointer", letterSpacing: ".05em", opacity: status === "sending" ? 0.7 : 1 }}>
                    {status === "sending" ? "Sending…" : "Send Message →"}
                  </button>
                  <div style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                    <Check size={12} style={{ flexShrink: 0 }} />
                    We respond within 4 business hours Mon–Fri &nbsp;·&nbsp; <span style={{ color: "#E8242A" }}>*</span> Required
                  </div>
                </form>
              )}
            </div>

            {/* Info Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, color: "#2D8CFF", marginTop: "2px" }}><Phone size={20} /></div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "14px", letterSpacing: ".04em", color: "#111", marginBottom: "4px" }}>Phone</h4>
                  <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.6 }}>(214) 272-7213<br />Mon–Fri, 8AM–6PM CT<br />Same-day callback for wholesale accounts</p>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, color: "#2D8CFF", marginTop: "2px" }}><Mail size={20} /></div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "14px", letterSpacing: ".04em", color: "#111", marginBottom: "4px" }}>Email</h4>
                  <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.6 }}>info.afapparel@gmail.com<br />Response within 4 business hours<br />Large orders: include SKU and quantity in subject</p>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, color: "#2D8CFF", marginTop: "2px" }}><MapPin size={20} /></div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "14px", letterSpacing: ".04em", color: "#111", marginBottom: "4px" }}>Facility & Shipping Hub</h4>
                  <p style={{ fontSize: "12.5px", color: "#555", lineHeight: 1.6 }}>Dallas, Texas<br />Orders before 2 PM CT ship same day<br />[FULL ADDRESS — ADD BEFORE LAUNCH]</p>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, color: "#2D8CFF", marginTop: "2px" }}><Clock size={20} /></div>
                <div style={{ width: "100%" }}>
                  <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "14px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>Business Hours</h4>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                    <tbody>
                      {[
                        ["Monday – Friday", "8:00 AM – 6:00 PM CT"],
                        ["Saturday", "9:00 AM – 1:00 PM CT"],
                        ["Sunday", "Closed"],
                        ["Federal Holidays", "Closed"],
                      ].map(([day, hrs]) => (
                        <tr key={day}>
                          <td style={{ padding: "3px 0", color: "#555", width: "55%" }}>{day}</td>
                          <td style={{ padding: "3px 0", color: hrs === "Closed" ? "#aaa" : "#111", fontWeight: hrs === "Closed" ? 400 : 600 }}>{hrs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div style={{ background: "#fff", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111", marginBottom: "8px" }}>Reach the Right Team</h2>
            <p style={{ fontSize: "13.5px", color: "#666" }}>Different questions, different experts — faster answers for you</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {[
              { icon: <Briefcase size={26} />, title: "Wholesale Sales", body: "New accounts, pricing questions, volume orders, and account applications.", email: "sales@afapparel.com" },
              { icon: <Wrench size={26} />, title: "Account Support", body: "Existing orders, shipping status, returns, exchange requests, and account management.", email: "support@afapparel.com" },
              { icon: <Tag size={26} />, title: "Private Label", body: "Custom styles, neck labels, exclusive colorways, and bulk manufacturing programs.", email: "privatelabel@afapparel.com" },
            ].map((d, di) => (
              <div key={di} style={{ background: "#F7F8FA", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "20px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", color: "#2D8CFF" }}>{d.icon}</div>
                <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "14px", letterSpacing: ".06em", color: "#111", marginBottom: "6px" }}>{d.title}</h4>
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.6, marginBottom: "10px" }}>{d.body}</p>
                <div style={{ fontSize: "12px", color: "#2D8CFF", fontWeight: 600 }}>{d.email}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: "#F7F8FA", padding: "56px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", letterSpacing: ".04em", color: "#111" }}>Quick Answers</h2>
          </div>
          <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              {
                q: "What's the fastest way to get a quote for a large order?",
                a: "Email sales@afapparel.com with your SKU(s), colors, size breakdown, and quantity. Include \"QUOTE REQUEST\" in the subject line. We respond within 2 business hours for orders over 500 units.",
              },
              {
                q: "How do I check my order status?",
                a: "Log in to your wholesale account and navigate to Order History. You'll find real-time tracking information for every shipment. For urgent inquiries, call (214) 272-7213 and reference your order number.",
              },
              {
                q: "Can I visit your Dallas facility?",
                a: "Yes, by appointment only. Contact us at least 48 hours in advance. We welcome visits from large accounts, private label partners, and corporate buyers evaluating AF as a supplier.",
              },
              {
                q: "How do I apply for NET 30 payment terms?",
                a: "NET 30 is available to established accounts with a consistent order history (typically 3+ orders over 90 days). Submit a request through your account dashboard or contact your account manager directly.",
              },
            ].map(f => (
              <details key={f.q} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "4px" }}>
                <summary style={{ padding: "14px 16px", fontSize: "13.5px", fontWeight: 700, color: "#111", cursor: "pointer", listStyle: "none" }}>{f.q}</summary>
                <div style={{ padding: "0 16px 14px", fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#f4f3ef", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4vw,42px)", color: "#0a1628", letterSpacing: ".04em", marginBottom: "14px" }}>
          NOT SURE WHERE TO START?
        </h2>
        <p style={{ color: "#444", fontSize: "14px", marginBottom: "28px" }}>
          Apply for a wholesale account and our team will reach out to walk you through everything.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <a href="/register" style={{ display: "inline-flex", alignItems: "center", background: "#E8242A", color: "#fff", padding: "12px 28px", fontFamily: "var(--font-bebas)", fontWeight: 700, fontSize: "15px", letterSpacing: ".05em", borderRadius: "3px", textDecoration: "none" }}>
            Apply for Wholesale →
          </a>
        </div>
        <div style={{ fontSize: "11px", color: "#666", marginTop: "16px" }}>
          Free · No commitment · Approved within 24 hours
        </div>
      </div>

    </div>
  );
}
