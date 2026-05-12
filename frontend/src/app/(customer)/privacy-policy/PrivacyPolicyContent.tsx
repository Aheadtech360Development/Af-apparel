"use client";

import { useState } from "react";
import { Package, ShoppingCart, FileText, Lock } from "lucide-react";

type PolicyId = "shipping" | "ordering" | "terms" | "privacy";

const POLICIES: { id: PolicyId; icon: React.ReactNode; label: string }[] = [
  { id: "shipping", icon: <Package size={14} />, label: "Shipping & Returns" },
  { id: "ordering", icon: <ShoppingCart size={14} />, label: "Ordering Info" },
  { id: "terms", icon: <FileText size={14} />, label: "Terms & Conditions" },
  { id: "privacy", icon: <Lock size={14} />, label: "Privacy Policy" },
];

export default function PrivacyPolicyPage() {
  const [active, setActive] = useState<PolicyId>("shipping");

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Announce */}
      <div style={{ background: "#E8242A", color: "#fff", textAlign: "center", padding: "7px 24px", fontSize: "12px", fontWeight: 600, letterSpacing: ".02em" }}>
        🇺🇸 AF Apparels — Clear Policies, No Surprises
      </div>

      {/* Hero */}
      <div style={{ background: "#111", padding: "36px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(20px,2.8vw,32px)", color: "#fff", marginBottom: "6px", letterSpacing: ".04em" }}>Policies &amp; Legal</h1>
          <p style={{ color: "#6B7280", fontSize: "13px" }}>Clear, plain-English policies for all AF Apparels wholesale customers</p>
        </div>
      </div>

      {/* Layout */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "200px 1fr", gap: "32px", alignItems: "start" }}>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "24px" }}>
          <div style={{ background: "#F7F8FA", border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".08em", borderBottom: "1px solid #E5E7EB" }}>Policies</div>
            {POLICIES.map(p => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "12px 16px", textAlign: "left", background: active === p.id ? "#fff" : "transparent", border: "none", borderBottom: "1px solid #E5E7EB", fontSize: "13px", fontWeight: active === p.id ? 700 : 500, color: active === p.id ? "#111" : "#555", cursor: "pointer", borderLeft: active === p.id ? "3px solid #E8242A" : "3px solid transparent" }}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
            <div style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".08em", borderBottom: "1px solid #E5E7EB" }}>Quick Links</div>
            <a href="/contact" style={{ display: "block", padding: "12px 16px", fontSize: "13px", color: "#555", textDecoration: "none", borderBottom: "1px solid #E5E7EB" }}>Contact Support</a>
            <a href="/track-order" style={{ display: "block", padding: "12px 16px", fontSize: "13px", color: "#555", textDecoration: "none" }}>Track My Order</a>
          </div>
        </div>

        {/* Content */}
        <div>

          {/* SHIPPING & RETURNS */}
          {active === "shipping" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", letterSpacing: ".04em", color: "#111", marginBottom: "4px" }}>Shipping &amp; Returns Policy</h2>
              <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, marginBottom: "20px" }}>Last updated: January 2025</div>

              <div style={{ background: "#dde8ff", borderLeft: "3px solid #2D8CFF", padding: "12px 16px", borderRadius: "0 4px 4px 0", fontSize: "13px", color: "#374151", marginBottom: "24px" }}>
                📦 <strong>Key Point:</strong> All orders placed before 2:00 PM CT on business days ship same day from our Dallas, TX facility. Orders received after 2:00 PM CT ship the next business day.
              </div>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Shipping Methods &amp; Timelines</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "20px" }}>
                <thead>
                  <tr style={{ background: "#F7F8FA" }}>
                    {["Method", "Estimated Delivery", "Cost"].map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#374151", borderBottom: "1px solid #E5E7EB", fontSize: "12px" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Standard Ground", "3–5 business days", "Free on orders over $500"],
                    ["Expedited (2-Day)", "2 business days", "$45 flat"],
                    ["Overnight", "1 business day", "Quote at checkout"],
                    ["Freight / LTL", "Varies by destination", "Quote provided"],
                  ].map(([m, d, c]) => (
                    <tr key={m} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>{m}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{d}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Free Shipping Threshold</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Standard ground shipping is complimentary on all orders totaling $500 or more (before tax). Orders under $500 are charged a flat shipping rate calculated at checkout based on weight and destination.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Order Processing</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>All orders are processed Monday through Friday, excluding federal holidays. Orders placed on weekends or holidays begin processing the next business day. You will receive a shipping confirmation email with tracking information once your order leaves our Dallas facility.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Shipping Carriers</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>We ship via UPS, FedEx, and regional carriers depending on destination and package size. Carrier selection is made at our discretion to ensure the fastest, most reliable delivery for your location. Freight shipments are coordinated through our logistics partners — contact us for freight quotes on pallet-size orders.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Returns Policy</h3>
              <div style={{ background: "#fef3c7", borderLeft: "3px solid #d97706", padding: "12px 16px", borderRadius: "0 4px 4px 0", fontSize: "13px", color: "#374151", marginBottom: "12px" }}>
                AF Apparels accepts returns on defective or incorrectly shipped items only. We do not accept returns on correctly shipped, undamaged merchandise due to the nature of wholesale bulk orders.
              </div>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>If you receive a shipment with defective goods, the wrong item, or incorrect quantities, contact us within <strong>7 business days of receipt</strong> to initiate a claim. Claims submitted after 7 days may not be eligible for replacement or credit.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Defective / Damaged Items</h3>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "16px" }}>
                <li style={{ marginBottom: "4px" }}>Contact info@afblanks.com with your order number and photos of the defective units</li>
                <li style={{ marginBottom: "4px" }}>Include the quantity affected and a brief description of the defect</li>
                <li style={{ marginBottom: "4px" }}>We will respond within 1 business day with resolution options</li>
                <li style={{ marginBottom: "4px" }}>Resolution options: replacement units, store credit, or refund (at AF discretion based on claim)</li>
                <li>Do not return items without prior authorization — unauthorized returns will not be accepted</li>
              </ul>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Incorrect Shipments</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>If your order arrives with incorrect items or quantities, we will ship the correct product at no charge and arrange pickup of the incorrect shipment. Contact us within 7 business days with your order number and a description of the discrepancy.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Refused Shipments</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Refused or unclaimed shipments are subject to a 15% restocking fee plus return shipping costs. If a shipment is refused without prior authorization from AF Apparels, the restocking fee and shipping charges will be deducted from any credit issued.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>International Shipping</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>AF Apparels currently ships to the continental United States and Canada. For Canadian shipments, duties and taxes are the responsibility of the buyer. Contact us for international freight inquiries outside of these regions.</p>
            </div>
          )}

          {/* ORDERING INFO */}
          {active === "ordering" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", letterSpacing: ".04em", color: "#111", marginBottom: "4px" }}>Ordering Information</h2>
              <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, marginBottom: "20px" }}>Last updated: January 2025</div>

              <div style={{ background: "#dde8ff", borderLeft: "3px solid #2D8CFF", padding: "12px 16px", borderRadius: "0 4px 4px 0", fontSize: "13px", color: "#374151", marginBottom: "24px" }}>
                🛒 <strong>Key Point:</strong> AF Apparels is a wholesale-only platform. All orders require an approved wholesale account. There are no minimums on in-stock items for standard orders.
              </div>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Wholesale Account Requirement</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>All purchases through AF Apparels require an approved wholesale business account. Account applications are reviewed within 24 business hours. Once approved, you have immediate access to wholesale pricing and the full product catalog.</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>To apply, complete the account application form. You will need your business name, contact information, business type, and an estimate of your monthly volume. There is no fee to apply and no minimum purchase commitment required.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Minimum Order Quantities (MOQ)</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "20px" }}>
                <thead>
                  <tr style={{ background: "#F7F8FA" }}>
                    {["Order Type", "Minimum", "Notes"].map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#374151", borderBottom: "1px solid #E5E7EB", fontSize: "12px" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["In-Stock Standard Items", "No minimum", "Order 1 unit or 10,000"],
                    ["Private Label (Custom Style)", "2,500 units per style per color", "See Private Label program"],
                    ["Custom Colorway", "2,500 units per color", "Pantone match available"],
                  ].map(([t, m, n]) => (
                    <tr key={t} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>{t}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{m}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Pricing &amp; Volume Discounts</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>AF Apparels pricing is tiered based on the total quantity in your cart. Volume discounts apply automatically — no coupon codes or negotiations required. Your per-unit price updates in real-time as you add quantities to your order. The tier structure is backend pricing logic and is not displayed in the interface.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Placing Orders</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>Once logged in, use the Bulk Order Grid on each product page to select colors and enter quantities per size. The grid displays real-time stock counts for each size per color. Add your completed order to cart, review the cart summary, and proceed to checkout.</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>For large orders (over 1,000 units) or custom configurations, you can use the &ldquo;Request a Quote&rdquo; option on any product page. Our sales team will respond within 2 business hours with pricing and availability confirmation.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Order Confirmation</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>You will receive an order confirmation email immediately after checkout. Review this confirmation carefully — it reflects the exact quantities, colors, and sizes ordered. Report any discrepancies to info@afblanks.com within 24 hours of receiving the confirmation.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Order Modifications &amp; Cancellations</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Orders can be modified or cancelled within 2 hours of placement by contacting info@afblanks.com with your order number. Orders that have already entered the picking and packing process cannot be modified or cancelled. Same-day orders (placed for same-day shipping) cannot be modified after confirmation.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Stock Availability</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Stock counts displayed in the Bulk Order Grid are updated in near-real time. In the rare event that an item becomes unavailable after your order is placed, we will contact you within 4 hours to offer: (1) a backordered fulfillment date, (2) a substitute from available inventory, or (3) a full refund for the unavailable units.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Payment Methods</h3>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "16px" }}>
                <li style={{ marginBottom: "6px" }}><strong>Credit / Debit Card:</strong> Visa, Mastercard, American Express — charged at checkout</li>
                <li style={{ marginBottom: "6px" }}><strong>ACH Bank Transfer:</strong> Routing and account number — 1–2 business day processing</li>
                <li style={{ marginBottom: "6px" }}><strong>Wire Transfer:</strong> Wire details provided after order placed — ship upon fund receipt</li>
                <li><strong>NET 30:</strong> Available to qualifying accounts with established order history (3+ orders over 90 days). Apply through your account dashboard.</li>
              </ul>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Sales Tax</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>AF Apparels collects sales tax in states where we have nexus, as required by law. If your business holds a valid sales tax exemption certificate, submit it to info@afblanks.com before your first order. Exemptions will be applied to your account within 1 business day.</p>
            </div>
          )}

          {/* TERMS & CONDITIONS */}
          {active === "terms" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", letterSpacing: ".04em", color: "#111", marginBottom: "4px" }}>Terms &amp; Conditions</h2>
              <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, marginBottom: "20px" }}>Last updated: January 2025 · Effective for all orders placed on or after this date</div>

              <div style={{ background: "#fee2e2", borderLeft: "3px solid #E8242A", padding: "12px 16px", borderRadius: "0 4px 4px 0", fontSize: "13px", color: "#374151", marginBottom: "24px" }}>
                ⚠️ These Terms &amp; Conditions govern all transactions between American Fashion (AF Apparels) and wholesale account holders. By placing an order, you agree to these terms. Please review carefully before your first order.
              </div>

              {[
                { n: "1", h: "Account Eligibility", body: "AF Apparels wholesale accounts are available to legally registered businesses operating in the United States or Canada. By applying for an account, you represent that your business is legitimate, registered, and that the information provided in your application is accurate. AF Apparels reserves the right to deny, suspend, or terminate any account at our discretion." },
                { n: "2", h: "Use of the Platform", body: "Your wholesale account is for business use only. You may not resell access to the platform, share account credentials, or use your account for personal purchases. Accounts found in violation of these terms will be suspended and any pending orders cancelled." },
                { n: "3", h: "Pricing & Payment Terms", body: null, multi: ["All prices listed are wholesale prices available exclusively to approved accounts. Prices are subject to change without notice. The price displayed at the time of checkout is the final price for that order. Payment is due according to the payment method selected at checkout (immediate for card/ACH; upon fund receipt for wire; NET 30 for qualifying accounts).", "Late payments on NET 30 accounts are subject to a 1.5% monthly finance charge (18% APR). Accounts with outstanding balances over 45 days may have their ordering privileges suspended until the balance is resolved."] },
                { n: "4", h: "Product Use", body: "AF Apparels blanks are sold for decoration and resale. AF Apparels makes no warranty regarding the suitability of products for any specific decoration method beyond what is stated in our Print Guide. It is the buyer's responsibility to test products against their specific equipment and processes before committing to production runs." },
                { n: "5", h: "Intellectual Property", body: "The AF Apparels brand, logo, product photography, and website content are the intellectual property of American Fashion LLC. You may not reproduce, distribute, or use our branding or imagery in your own marketing without written permission." },
                { n: "6", h: "Limitation of Liability", body: "AF Apparels' liability for any claim arising from a transaction is limited to the value of the goods in question. We are not liable for indirect, consequential, or incidental damages including lost profits, production downtime, or client penalties arising from defective or delayed goods." },
                { n: "7", h: "Governing Law", body: "These Terms & Conditions are governed by the laws of the State of Texas. Any disputes arising from transactions with AF Apparels shall be resolved in the courts of Dallas County, Texas." },
                { n: "8", h: "Changes to Terms", body: "AF Apparels reserves the right to update these Terms & Conditions at any time. Updated terms are effective immediately upon posting. Continued use of the platform following an update constitutes acceptance of the revised terms." },
                { n: "9", h: "Contact for Legal Matters", body: "For questions regarding these Terms & Conditions, contact: info@afblanks.com or write to AF Apparels, 10719 Turbeville Rd, Dallas, TX 75243." },
              ].map(s => (
                <div key={s.n}>
                  <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>{s.n}. {s.h}</h3>
                  {s.multi ? s.multi.map((p, i) => <p key={i} style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>{p}</p>) : <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>{s.body}</p>}
                </div>
              ))}
            </div>
          )}

          {/* PRIVACY POLICY */}
          {active === "privacy" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", letterSpacing: ".04em", color: "#111", marginBottom: "4px" }}>Privacy Policy</h2>
              <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, marginBottom: "20px" }}>Last updated: January 2025</div>

              <div style={{ background: "#dde8ff", borderLeft: "3px solid #2D8CFF", padding: "12px 16px", borderRadius: "0 4px 4px 0", fontSize: "13px", color: "#374151", marginBottom: "24px" }}>
                🔒 <strong>Short Version:</strong> We collect only the information necessary to operate your wholesale account and fulfill your orders. We do not sell your data. We do not share it with third parties except as required to process payments and ship orders.
              </div>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>1. Information We Collect</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "10px" }}>When you create an account or place an order, we collect:</p>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "16px" }}>
                <li style={{ marginBottom: "4px" }}>Business name, contact name, email address, and phone number</li>
                <li style={{ marginBottom: "4px" }}>Shipping and billing addresses</li>
                <li style={{ marginBottom: "4px" }}>Business type and estimated monthly volume (from account application)</li>
                <li style={{ marginBottom: "4px" }}>Order history and transaction records</li>
                <li style={{ marginBottom: "4px" }}>Payment information (processed securely — we do not store full card numbers)</li>
                <li>Website usage data (pages visited, time on site, browser type) via cookies</li>
              </ul>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>2. How We Use Your Information</h3>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "16px" }}>
                <li style={{ marginBottom: "4px" }}>Processing and fulfilling your orders</li>
                <li style={{ marginBottom: "4px" }}>Sending order confirmations, shipping notifications, and account updates</li>
                <li style={{ marginBottom: "4px" }}>Providing customer support and responding to inquiries</li>
                <li style={{ marginBottom: "4px" }}>Improving our platform and product offerings based on usage patterns</li>
                <li style={{ marginBottom: "4px" }}>Sending relevant product updates, new SKU announcements, and promotional offers (opt-out available)</li>
                <li>Complying with legal obligations (tax records, fraud prevention)</li>
              </ul>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>3. Information Sharing</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "10px" }}>We share your information only with:</p>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "12px" }}>
                <li style={{ marginBottom: "4px" }}><strong>Payment processors</strong> (Stripe, ACH partners) — to process transactions securely</li>
                <li style={{ marginBottom: "4px" }}><strong>Shipping carriers</strong> (UPS, FedEx) — to fulfill and track your orders</li>
                <li style={{ marginBottom: "4px" }}><strong>Accounting software</strong> — for internal financial record-keeping</li>
                <li><strong>Legal authorities</strong> — when required by law or to prevent fraud</li>
              </ul>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>We do not sell, rent, or trade your personal or business information to third parties for marketing purposes.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>4. Data Security</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Your data is stored on secure, encrypted servers. We use SSL/TLS encryption for all data transmission. Payment card data is processed by PCI-DSS compliant payment processors — we do not store full card numbers on our systems. Access to customer data is restricted to AF Apparels staff who need it to fulfill their job responsibilities.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>5. Cookies</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Our platform uses cookies to maintain your login session, remember your cart, and analyze usage patterns. Essential cookies (login, cart) are required for the platform to function. Analytics cookies can be disabled in your browser settings without affecting your ability to use the platform.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>6. Data Retention</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>We retain your account and order information for 7 years as required for tax and accounting purposes. If you close your account, your personal information will be removed from active systems within 90 days, subject to legal retention requirements.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>7. Your Rights</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>You have the right to: access the data we hold about you; request correction of inaccurate data; request deletion of your data (subject to legal retention requirements); opt out of marketing communications at any time. To exercise any of these rights, contact info@afblanks.com.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>8. Contact</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>For privacy-related questions: info@afblanks.com or +1 (469) 367-9753.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
