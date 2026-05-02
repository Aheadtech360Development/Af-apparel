import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Legal | AF Apparels",
  description: "AF Apparels privacy policy, terms of service, shipping policy, and return policy.",
};

const sections = [
  {
    id: "shipping",
    title: "Shipping Policy",
    icon: "📦",
    updated: "January 1, 2025",
    content: [
      {
        heading: "Processing Times",
        text: "Orders placed before 3:00 PM CST Monday–Friday are processed same day. Orders placed after 3 PM or on weekends/holidays are processed the next business day.",
      },
      {
        heading: "Shipping Carriers",
        text: "We ship via UPS, FedEx, and USPS. Carrier selection is based on shipment size, destination, and service level selected at checkout.",
      },
      {
        heading: "Delivery Estimates",
        text: "Ground shipping from our Dallas, TX warehouse:\n• Zone 1–3 (TX, OK, LA, AR, NM): 1–2 business days\n• Zone 4–5 (Midwest, Southeast): 2–3 business days\n• Zone 6–7 (Northeast, Mountain): 3–4 business days\n• Zone 8 (West Coast, Hawaii, Alaska): 4–5 business days",
      },
      {
        heading: "Free Shipping",
        text: "Free ground shipping is available on qualifying wholesale orders. Thresholds vary by discount group tier. See your account dashboard for your specific threshold.",
      },
      {
        heading: "Freight & LTL",
        text: "Orders exceeding 150 lbs or requiring pallet shipment will be quoted separately. Contact your account manager for freight pricing.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Claims",
    icon: "🔄",
    updated: "January 1, 2025",
    content: [
      {
        heading: "Defective Merchandise",
        text: "We stand behind our product quality. If you receive defective merchandise, contact us within 14 days of delivery with photos. We will replace defective items at no charge or issue a credit to your account.",
      },
      {
        heading: "Shipping Errors",
        text: "If we shipped the wrong item or quantity, contact us within 7 days of delivery. We will arrange return shipping at our expense and reship the correct order promptly.",
      },
      {
        heading: "Non-Defective Returns",
        text: "Returns on non-defective merchandise are accepted within 30 days of delivery, subject to a 15% restocking fee. Items must be in original, unworn, undecorated condition with tags attached.",
      },
      {
        heading: "Decorated Merchandise",
        text: "Decorated merchandise (printed, embroidered, or otherwise customized items) cannot be returned unless the defect is manufacturing-related.",
      },
      {
        heading: "Initiating a Return",
        text: "Email returns@afblanks.com or use the RMA portal in your account dashboard. Include your order number, items to be returned, and reason for return.",
      },
    ],
  },
  {
    id: "terms",
    title: "Terms of Service",
    icon: "📋",
    updated: "January 1, 2025",
    content: [
      {
        heading: "Wholesale Account Eligibility",
        text: "Wholesale accounts are available to registered businesses only. By applying for an account, you certify that you are purchasing goods for commercial resale or business use, not for personal consumption.",
      },
      {
        heading: "Payment Terms",
        text: "Approved accounts may qualify for NET 30 payment terms. All invoices are due within the stated terms. Late payments may result in account suspension and finance charges of 1.5% per month.",
      },
      {
        heading: "Pricing",
        text: "Prices are subject to change without notice. The price in effect at the time of order placement will apply. Volume discounts are applied automatically at checkout based on your account tier.",
      },
      {
        heading: "Product Availability",
        text: "All products are sold subject to availability. We reserve the right to substitute comparable items when a specific item is unavailable. We will notify you before substituting.",
      },
      {
        heading: "Limitation of Liability",
        text: "AF Apparels' liability is limited to the purchase price of the goods in question. We are not liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: "🔒",
    updated: "January 1, 2025",
    content: [
      {
        heading: "Information We Collect",
        text: "We collect business contact information (name, company, email, phone), billing and shipping addresses, order history, and payment method information (processed securely via Stripe — we do not store card numbers).",
      },
      {
        heading: "How We Use Your Information",
        text: "We use your information to process orders, manage your account, send transactional emails (order confirmations, shipping updates), and occasionally send promotional communications. You may opt out of marketing emails at any time.",
      },
      {
        heading: "Data Sharing",
        text: "We do not sell your personal data. We share information only with service providers necessary to operate our business (shipping carriers, payment processors, accounting software). All providers are contractually bound to protect your data.",
      },
      {
        heading: "Data Security",
        text: "Our platform uses industry-standard TLS encryption for all data transmission. Sensitive data is encrypted at rest. We conduct regular security audits and penetration testing.",
      },
      {
        heading: "Your Rights",
        text: "You may request access to, correction of, or deletion of your personal data by contacting us at privacy@afblanks.com. We respond to all verifiable requests within 30 days.",
      },
      {
        heading: "Cookies",
        text: "We use essential cookies for session management and authentication. We use analytics cookies (Google Analytics) to understand traffic patterns. You may disable non-essential cookies via your browser settings.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "#F4F3EF", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#2A2830", color: "#fff", padding: "52px 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "52px", letterSpacing: ".04em", marginBottom: "10px" }}>Legal &amp; Policies</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,.6)" }}>Shipping, returns, terms of service, and privacy policy for AF Apparels wholesale accounts.</p>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 32px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "40px", alignItems: "start" }}>
        {/* Sidebar nav */}
        <div style={{ position: "sticky", top: "24px" }}>
          <nav style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "12px", overflow: "hidden" }}>
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", textDecoration: "none", fontSize: "13px", fontWeight: 600, color: "#2A2830", borderBottom: "1px solid #F4F3EF", transition: "background .15s" }}
              >
                <span>{s.icon}</span>
                <span>{s.title}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {sections.map(s => (
            <div key={s.id} id={s.id} style={{ background: "#fff", border: "1.5px solid #E2E0DA", borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #E2E0DA" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "28px" }}>{s.icon}</span>
                  <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", letterSpacing: ".04em", color: "#2A2830" }}>{s.title}</h2>
                </div>
                <p style={{ fontSize: "11px", color: "#aaa", fontWeight: 600 }}>Last updated: {s.updated}</p>
              </div>
              <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {s.content.map(c => (
                  <div key={c.heading}>
                    <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#2A2830", marginBottom: "6px" }}>{c.heading}</h3>
                    <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, whiteSpace: "pre-line" }}>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
