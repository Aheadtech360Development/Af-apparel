"use client";

import { useState } from "react";

type PolicyId = "shipping" | "ordering" | "terms" | "privacy";

const TABS: { id: PolicyId; label: string }[] = [
  { id: "shipping", label: "Shipping & Returns" },
  { id: "ordering", label: "Ordering Info" },
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
];

const sectionStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "#1A1A1A",
  borderBottom: "1px solid #E2E2DE",
  paddingBottom: "10px",
  marginBottom: "12px",
  marginTop: "28px",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  color: "#6B6B6B",
  lineHeight: 1.75,
  marginBottom: "20px",
};

export default function PrivacyPolicyPage() {
  const [active, setActive] = useState<PolicyId>("shipping");

  return (
    <div style={{ background: "#F8F8F6", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: "#FFFFFF", padding: "48px 24px 0", borderBottom: "1px solid #E2E2DE" }}>
        <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "40px", fontWeight: 600, color: "#1A1A1A", marginBottom: "24px", lineHeight: 1.15 }}>Policies</h1>
          {/* Tab nav */}
          <div style={{ display: "flex", gap: "0", borderBottom: "none", flexWrap: "wrap" }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: active === tab.id ? "#1C3557" : "#6B6B6B",
                  padding: "10px 20px",
                  background: "transparent",
                  border: "none",
                  borderBottom: active === tab.id ? "2px solid #1C3557" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "color .15s",
                  marginBottom: "-1px",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ background: "#F8F8F6", padding: "48px 24px 64px" }}>
        <div style={{ maxWidth: "760px" }}>

          {active === "shipping" && (
            <div>
              <h2 style={sectionStyle}>Shipping</h2>
              <p style={bodyStyle}>We ship from our Dallas, TX warehouse. Standard ground shipping is available to all 50 states. Expedited (2-day) shipping is available for an additional fee. Orders placed before 2PM CT typically ship same day.</p>

              <h2 style={sectionStyle}>Will Call (Local Pickup)</h2>
              <p style={bodyStyle}>Will Call pickup is available from our Dallas, TX location during business hours (Mon–Fri, 8AM–5PM CT). Select &lsquo;Will Call&rsquo; at checkout. You will receive an email when your order is ready for pickup.</p>

              <h2 style={sectionStyle}>Returns & Claims</h2>
              <p style={bodyStyle}>All claims for shortages, damages, or defects must be reported within 7 days of delivery. Email info@afblanks.com with your order number and a description of the issue. Returns are accepted for defective merchandise only. Non-defective items cannot be returned.</p>
            </div>
          )}

          {active === "ordering" && (
            <div>
              <h2 style={sectionStyle}>Placing an Order</h2>
              <p style={bodyStyle}>Orders can be placed online at any time. Wholesale accounts are required for wholesale pricing. Guest checkout is available at standard retail pricing.</p>

              <h2 style={sectionStyle}>Order Confirmation</h2>
              <p style={bodyStyle}>You will receive an order confirmation email after placing your order. If you do not receive a confirmation within 1 hour, check your spam folder or contact us.</p>

              <h2 style={sectionStyle}>Changes & Cancellations</h2>
              <p style={bodyStyle}>Order changes and cancellations must be requested within 1 hour of placing the order. Once an order has been picked or packed, changes cannot be made.</p>

              <h2 style={sectionStyle}>Stock & Availability</h2>
              <p style={bodyStyle}>All orders are subject to stock availability. In the event of a stock shortage, we will contact you to discuss alternatives or issue a refund.</p>

              <h2 style={sectionStyle}>Payment</h2>
              <p style={bodyStyle}>We accept all major credit cards, ACH/bank transfer, and Net 30 terms (for approved wholesale accounts). Payment is due at time of order unless Net 30 terms are in place.</p>

              <h2 style={sectionStyle}>Sales Tax</h2>
              <p style={bodyStyle}>Sales tax is collected in states where we have nexus, in accordance with applicable laws. Tax-exempt customers must provide a valid exemption certificate.</p>
            </div>
          )}

          {active === "terms" && (
            <div>
              <h2 style={sectionStyle}>Payment Methods</h2>
              <p style={bodyStyle}>We accept Visa, Mastercard, American Express, Discover, ACH bank transfer, and Net 30 (approved wholesale accounts only).</p>

              <h2 style={sectionStyle}>No Minimums</h2>
              <p style={bodyStyle}>There is no minimum order quantity. Order as few or as many units as you need.</p>

              <h2 style={sectionStyle}>Order Processing</h2>
              <p style={bodyStyle}>Orders are processed Monday through Friday. Orders placed after 2PM CT or on weekends will be processed the next business day.</p>

              <h2 style={sectionStyle}>Wholesale Accounts</h2>
              <p style={bodyStyle}>Wholesale pricing is available to approved wholesale accounts only. To apply, complete the wholesale application on our website.</p>

              <h2 style={sectionStyle}>Pricing</h2>
              <p style={bodyStyle}>Prices are subject to change without notice. Your order will be billed at the price shown at time of checkout.</p>

              <h2 style={sectionStyle}>Claims & Returns</h2>
              <p style={bodyStyle}>All claims must be made within 7 days of delivery. We are not responsible for damage caused after delivery. Returns accepted for defective merchandise only.</p>

              <h2 style={sectionStyle}>Cancellations</h2>
              <p style={bodyStyle}>Orders may be cancelled within 1 hour of placement. After that, cancellations are not guaranteed.</p>

              <h2 style={sectionStyle}>Liability</h2>
              <p style={bodyStyle}>AF Apparels is not liable for any indirect, incidental, or consequential damages arising from the use of our products.</p>
            </div>
          )}

          {active === "privacy" && (
            <div>
              <p style={{ ...bodyStyle, color: "#9B9B9B", fontSize: "12px" }}>Last updated: January 30, 2025</p>

              <h2 style={sectionStyle}>What We Collect</h2>
              <p style={bodyStyle}>We collect information you provide when placing orders, creating an account, or contacting us. This includes name, email, shipping address, payment information, and order history.</p>

              <h2 style={sectionStyle}>How We Use It</h2>
              <p style={bodyStyle}>We use your information to process orders, communicate about your account, and improve our service. We do not sell your personal information.</p>

              <h2 style={sectionStyle}>Who We Share It With</h2>
              <p style={bodyStyle}>We share your information with shipping carriers (to fulfill orders), payment processors (to process payments), and service providers who assist our operations. All are bound by confidentiality agreements.</p>

              <h2 style={sectionStyle}>Cookies</h2>
              <p style={bodyStyle}>We use cookies to maintain your session, remember your cart, and understand how our site is used. You can disable cookies in your browser settings, but some features may not work correctly.</p>

              <h2 style={sectionStyle}>Your Rights</h2>
              <p style={bodyStyle}>You may request access to, correction of, or deletion of your personal data at any time by contacting info@afblanks.com.</p>

              <h2 style={sectionStyle}>Children</h2>
              <p style={bodyStyle}>Our services are not directed to children under 13. We do not knowingly collect information from children.</p>

              <h2 style={sectionStyle}>Contact</h2>
              <p style={bodyStyle}>For privacy questions, contact us at info@afblanks.com or (214) 272-7213.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
