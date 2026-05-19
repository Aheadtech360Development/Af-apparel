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

const TERMS_FAQS: { h: string; body?: string; multi?: string[] }[] = [
  {
    h: "WHAT PAYMENT METHODS ARE AVAILABLE?",
    multi: [
      "We accept cash (will call only), credit cards, approved company/personal checks, and cashier's checks. Term payments are offered for buyers that are approved by our credit department or that have built a sufficient credit history with AF Apparels.",
      "For more information about term payments please contact the credit department at 469-367-9753.",
    ],
  },
  {
    h: "ARE THERE MINIMUMS?",
    body: "We do not have any minimum order quantities.",
  },
  {
    h: "WHERE DO I SUBMIT MY PO?",
    body: "Please e-mail all POs to info@afblanks.com",
  },
  {
    h: "HOW LONG WILL IT TAKE TO PROCESS MY ORDER?",
    body: "Most orders, if placed before 1:00PM PDT will be completed same day. We strive to process orders for same day shipping/pickup but due to varying situations, this isn't always possible. If you need an order rushed please reach out to info@afblanks.com or call customer service at 469-367-9753 and we will do our best to accommodate your needs.",
  },
  {
    h: "WHAT SHIPPING METHODS ARE AVAILABLE?",
    body: "Orders are shipped via USPS/UPS / FedEx / OnTrac ground or a preferred carrier unless otherwise indicated at the time the order is placed. If you would like to use your own UPS or FedEx account, please include the information at the time of ordering.",
  },
  {
    h: "DO YOU HAVE WILL CALL OPTIONS?",
    multi: [
      'Yes, please allow a minimum 3 hours from the time you place the order. For multiple orders please allow more time to complete all orders. Please note that the cutoff time is 1:00 PM PDT. Any orders placed after this time may not be available for same day pick up. Due to limited space, we can hold a will call order for 5 business days otherwise it may be restocked and subject to a 10% restocking fee. Please wait for your "Ready for Pickup" email before checking into the office for any pickup orders.',
      "Will Call Hours: Monday–Friday, 8:30AM – 4:30PM PDT",
    ],
  },
  {
    h: "WILL I RECEIVE AN E-MAIL WHEN MY ORDER SHIPS?",
    body: "Yes, you will receive an e-mail notification when your order is shipped. Please note the cutoff time for same day shipping is 1:00 PM PDT. Any orders placed after this time may be shipped the following business day.",
  },
  {
    h: "WHAT IS YOUR CLAIM / RETURN POLICY?",
    multi: [
      "Please inspect all merchandise before washing, printing or any alterations. We cannot accept returns or exchanges that have been altered in any way. All claims must be made within 5 days of receipt of goods and must be submitted by e-mail to info@afblanks.com. All returned merchandise will be refused if not accompanied with a Return Authorization and are subject to a 10% restocking fee. Customers will be responsible for shipping costs on all returned items that AF Apparels is not at fault for.",
      "General Inquiries: info@afblanks.com · Claims/Exchanges/Returns: info@afblanks.com",
    ],
  },
  {
    h: "WHAT IS YOUR TIME FRAME FOR RETURN REQUESTS?",
    body: "Please inspect all merchandise before washing, printing or any alterations. All claims must be made within 5 days of receipt of goods. Please allow 2–3 business days to process return requests. Once your request has been approved you will receive a Return Authorization (RA). All returns/exchanges will be refused if not accompanied with a Return Authorization. All RA's are valid for 14 days. If the merchandise has not been received within this time a new return request will need to be submitted.",
  },
  {
    h: "WHAT IF THE DELIVERED MERCHANDISE IS DAMAGED?",
    body: "At AF Apparels, we stand behind our product and if any type of damage is received in an order, we will replace or refund the item(s) immediately. Any replacements will be shipped by original shipping method. Please note all claims must be made within 5 days of receipt of goods and we cannot replace or provide a refund for any item(s) that are altered in any way from its original condition.",
  },
  {
    h: "WHAT IF I RECEIVED THE INCORRECT STYLE, SIZE, OR COLOR?",
    body: "Please inspect all merchandise before washing, printing or any other alterations. It is the Buyer's responsibility to verify that the merchandise received matches what was ordered and resolve any claims with AF Apparels before the garments are altered. All claims must be made within 5 days of receipt of goods. Replacements will be shipped by original shipping method. Please contact our returns department by email at info@afblanks.com or by phone at 469-367-9753 in order to start the return authorization process.",
  },
  {
    h: "WHO IS RESPONSIBLE FOR RETURN SHIPPING COSTS?",
    body: "Customers will be responsible for shipping costs on all returned items that are not a result of AF error.",
  },
  {
    h: "CAN I CANCEL AN ORDER?",
    multi: [
      "Once you have received a confirmation e-mail, your order cannot be cancelled. Please call customer service to make any changes or to cancel.",
      "Customer Service: 469-367-9753 · Monday–Friday, 8:30AM – 5:00PM PDT",
    ],
  },
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
      <div style={{ background: "#1b3a5c", padding: "36px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(20px,2.8vw,32px)", color: "#fff", marginBottom: "6px", letterSpacing: ".04em" }}>Policies &amp; Legal</h1>
          <p style={{ color: "#6B7280", fontSize: "13px" }}>Clear, plain-English policies for all AF Apparels wholesale customers</p>
        </div>
      </div>

      {/* Layout */}
      <div className="privacy-layout" style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "200px 1fr", gap: "32px", alignItems: "start" }}>

        {/* Sidebar */}
        <div className="privacy-sidebar" style={{ position: "sticky", top: "24px" }}>
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

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Shipping Policy</h3>
              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>WHAT SHIPPING METHODS ARE AVAILABLE?</h4>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "24px" }}>Orders are shipped via USPS/UPS / FedEx / OnTrac ground or a preferred carrier unless otherwise indicated at the time the order is placed. If you would like to use your own UPS or FedEx account, please include the information at the time of ordering.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Refund Policy</h3>
              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>WHAT IS YOUR CLAIM / RETURN POLICY?</h4>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "20px" }}>Please inspect all merchandise before washing, printing or any alterations. We cannot accept returns or exchanges that have been altered in any way. All claims must be made within 5 days of receipt of goods and must be submitted by e-mail to info@afblanks.com. All returned merchandise will be refused if not accompanied with a Return Authorization and are subject to a 10% restocking fee. Customers will be responsible for shipping costs on all returned items that AF Apparels is not at fault for.</p>

              <div style={{ background: "#F7F8FA", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "16px", fontSize: "13px", color: "#555", lineHeight: 1.8 }}>
                <p style={{ margin: "0 0 4px" }}>General Inquiries: <a href="mailto:info@afblanks.com" style={{ color: "#1B3A5C" }}>info@afblanks.com</a></p>
                <p style={{ margin: "0 0 4px" }}>Claims/Exchanges/Returns: <a href="mailto:info@afblanks.com" style={{ color: "#1B3A5C" }}>info@afblanks.com</a></p>
                <p style={{ margin: 0 }}>Telephone: <a href="tel:4693679753" style={{ color: "#1B3A5C" }}>469-367-9753</a></p>
              </div>
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
              <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "20px", minWidth: "380px" }}>
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
              </div>

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
              <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, marginBottom: "20px" }}>Terms of service</div>

              {TERMS_FAQS.map((item, i) => (
                <div key={i}>
                  <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>{item.h}</h3>
                  {item.multi
                    ? item.multi.map((p, j) => <p key={j} style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>{p}</p>)
                    : <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>{item.body}</p>
                  }
                </div>
              ))}
            </div>
          )}

          {/* PRIVACY POLICY */}
          {active === "privacy" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", letterSpacing: ".04em", color: "#111", marginBottom: "4px" }}>Privacy Policy</h2>
              <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, marginBottom: "20px" }}>Last updated: January 30, 2025</div>

              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>This Privacy Policy describes how AF Apparels Retail (the &ldquo;Site&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from retail.afapparels.com (the &ldquo;Site&rdquo;) or otherwise communicate with us regarding the Site (collectively, the &ldquo;Services&rdquo;). For purposes of this Privacy Policy, &ldquo;you&rdquo; and &ldquo;your&rdquo; means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Please read this Privacy Policy carefully. By using and accessing any of the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not use or access any of the Services.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Changes to This Privacy Policy</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the &ldquo;Last updated&rdquo; date and take any other steps required by applicable law.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>How We Collect and Use Your Personal Information</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>To provide the Services, we collect and have collected over the past 12 months personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide or improve the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>What Personal Information We Collect</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term &ldquo;personal information&rdquo;, we are referring to information that identifies, relates to, describes or can be associated with you. The following sections describe the categories and specific types of personal information we collect.</p>

              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>Information We Collect Directly from You</h4>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "8px" }}>Information that you directly submit to us through our Services may include:</p>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "16px" }}>
                <li style={{ marginBottom: "4px" }}>Contact details including your name, address, phone number, and email.</li>
                <li style={{ marginBottom: "4px" }}>Order information including your name, billing address, shipping address, payment confirmation, email address, and phone number.</li>
                <li style={{ marginBottom: "4px" }}>Account information including your username, password, security questions and other information used for account security purposes.</li>
                <li>Customer support information including the information you choose to include in communications with us, for example, when sending a message through the Services.</li>
              </ul>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Some features of the Services may require you to directly provide us with certain information about yourself. You may elect not to provide this information, but doing so may prevent you from using or accessing these features.</p>

              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>Information We Collect about Your Usage</h4>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>We may also automatically collect certain information about your interaction with the Services (&ldquo;Usage Data&rdquo;). To do this, we may use cookies, pixels and similar technologies (&ldquo;Cookies&rdquo;). Usage Data may include information about how you access and use our Site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with the Services.</p>

              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>Information We Obtain from Third Parties</h4>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "8px" }}>Finally, we may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as:</p>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "12px" }}>
                <li style={{ marginBottom: "4px" }}>Companies who support our Site and Services, such as Shopify.</li>
                <li>Our payment processors, who collect payment information (e.g., bank account, credit or debit card information, billing address) to process your payment in order to fulfill your orders and provide you with products or services you have requested, in order to perform our contract with you.</li>
              </ul>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>When you visit our Site, open or click on emails we send you, or interact with our Services or advertisements, we, or third parties we work with, may automatically collect certain information using online tracking technologies such as pixels, web beacons, software developer kits, third-party libraries, and cookies. Any information we obtain from third parties will be treated in accordance with this Privacy Policy.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>How We Use Your Personal Information</h3>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "16px" }}>
                <li style={{ marginBottom: "4px" }}><strong>Providing Products and Services.</strong> We use your personal information to provide you with the Services in order to perform our contract with you, including to process your payments, fulfill your orders, to send notifications to you related to your account, purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage your account, to arrange for shipping, and facilitate any returns and exchanges.</li>
                <li style={{ marginBottom: "4px" }}><strong>Marketing and Advertising.</strong> We may use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you advertisements for products or services.</li>
                <li style={{ marginBottom: "4px" }}><strong>Security and Fraud Prevention.</strong> We use your personal information to detect, investigate or take action regarding possible fraudulent, illegal or malicious activity. If you choose to use the Services and register an account, you are responsible for keeping your account credentials safe.</li>
                <li><strong>Communicating with You and Service Improvement.</strong> We use your personal information to provide you with customer support and improve our Services.</li>
              </ul>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Cookies</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>Like many websites, we use Cookies on our Site. We use Cookies to power and improve our Site and our Services (including to remember your actions and preferences), to run analytics and better understand user interaction with the Services. We may also permit third parties and service providers to use Cookies on our Site to better tailor the services, products and advertising on our Site and other websites.</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "12px" }}>Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies through your browser controls. Please keep in mind that removing or blocking Cookies can negatively impact your user experience and may cause some of the Services, including certain features and general functionality, to work incorrectly or no longer be available.</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Our website also recognizes the Global Privacy Control (GPC) signal, which enables you to opt-out of certain uses or disclosures of your information.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>How We Disclose Personal Information</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "8px" }}>In certain circumstances, we may disclose your personal information to third parties for contract fulfillment purposes, legitimate purposes and other reasons subject to this Privacy Policy. Such circumstances may include:</p>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "16px" }}>
                <li style={{ marginBottom: "4px" }}>With vendors or other third parties who perform services on our behalf (e.g., IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping).</li>
                <li style={{ marginBottom: "4px" }}>With business and marketing partners to provide services and advertise to you.</li>
                <li style={{ marginBottom: "4px" }}>When you direct, request us or otherwise consent to our disclosure of certain information to third parties, such as to ship you products or through your use of social media widgets or login integrations, with your consent.</li>
                <li style={{ marginBottom: "4px" }}>With our affiliates or otherwise within our corporate group, in our legitimate interests to run a successful business.</li>
                <li>In connection with a business transaction such as a merger or bankruptcy, to comply with any applicable legal obligations (including to respond to subpoenas, search warrants and similar requests), to enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.</li>
              </ul>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>We do not use or disclose sensitive personal information without your consent or for the purposes of inferring characteristics about you. We have &ldquo;sold&rdquo; and &ldquo;shared&rdquo; personal information over the preceding 12 months for the purpose of engaging in advertising and marketing activities with business and marketing partners.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Third Party Websites and Links</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Our Site may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites. Our inclusion of such links does not, by itself, imply any endorsement of the content on such platforms or of their owners or operators, except as disclosed on the Services.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Children&apos;s Data</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>The Services are not intended to be used by children, and we do not knowingly collect any personal information about children. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted. As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we &ldquo;share&rdquo; or &ldquo;sell&rdquo; personal information of individuals under 16 years of age.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Security and Retention of Your Information</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee &ldquo;perfect security.&rdquo; In addition, any information you send to us may not be secure while in transit. We recommend that you do not use insecure channels to communicate sensitive or confidential information to us. How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide the Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Your Rights</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "8px" }}>Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.</p>
              <ul style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, paddingLeft: "20px", marginBottom: "12px" }}>
                <li style={{ marginBottom: "4px" }}><strong>Right to Access / Know:</strong> You may have a right to request access to personal information that we hold about you, including details relating to the ways in which we use and share your information.</li>
                <li style={{ marginBottom: "4px" }}><strong>Right to Delete:</strong> You may have a right to request that we delete personal information we maintain about you.</li>
                <li style={{ marginBottom: "4px" }}><strong>Right to Correct:</strong> You may have a right to request that we correct inaccurate personal information we maintain about you.</li>
                <li style={{ marginBottom: "4px" }}><strong>Right of Portability:</strong> You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions.</li>
                <li style={{ marginBottom: "4px" }}><strong>Restriction of Processing:</strong> You may have the right to ask us to stop or restrict our processing of personal information.</li>
                <li style={{ marginBottom: "4px" }}><strong>Withdrawal of Consent:</strong> Where we rely on consent to process your personal information, you may have the right to withdraw this consent.</li>
                <li style={{ marginBottom: "4px" }}><strong>Appeal:</strong> You may have a right to appeal our decision if we decline to process your request. You can do so by replying directly to our denial.</li>
                <li><strong>Managing Communication Preferences:</strong> We may send you promotional emails, and you may opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you.</li>
              </ul>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>You may exercise any of these rights where indicated on our Site or by contacting us using the contact details provided below. We will not discriminate against you for exercising any of these rights.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Complaints</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>If you have complaints about how we process your personal information, please contact us using the contact details provided below. If you are not satisfied with our response to your complaint, depending on where you live you may have the right to appeal our decision by contacting us using the contact details set out below, or lodge your complaint with your local data protection authority.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>International Users</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>Please note that we may transfer, store and process your personal information outside the country you live in. Your personal information is also processed by staff and third party service providers and partners in these countries. If we transfer your personal information out of Europe, we will rely on recognized transfer mechanisms like the European Commission&apos;s Standard Contractual Clauses, or any equivalent contracts issued by the relevant competent authority of the UK, as relevant, unless the data transfer is to a country that has been determined to provide an adequate level of protection.</p>

              <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: ".04em", color: "#111", margin: "20px 0 10px" }}>Contact</h3>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>Should you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of the rights available to you, please call or email us at <a href="mailto:info.afapparel@gmail.com" style={{ color: "#1B3A5C" }}>info.afapparel@gmail.com</a> or contact us at 10719 Turbeville Road, Dallas, TX, 75243, US.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
