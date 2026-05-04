export default function WhyChooseUs() {
  const rows = [
    { num: "01", h: "No Distributor Markup", p: "We ship direct from our Dallas facility. No intermediaries means 15–30% lower unit cost vs. traditional wholesale." },
    { num: "02", h: "Print-Optimized Fabrics", p: "High-density stitch, pre-shrunk ring-spun cotton. Designed for screen print, DTF, embroidery, and sublimation." },
    { num: "03", h: "Same-Day Fulfillment", p: "Cut-off 2PM Central. Every item on this site is in our Dallas warehouse, ready to ship." },
    { num: "04", h: "Consistent Run-to-Run Quality", p: "ISO 9000 production process. Same weight, same shrink rate, same color accuracy every order." },
    { num: "05", h: "Scale With Your Business", p: "1 unit to 10,000 units. No minimum on in-stock. Private label from 2,500 pcs/style/color for your own brand." },
  ];

  return (
    <section style={{ padding: "60px 0", background: "#F4F6F9" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: "48px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1.2", minWidth: "260px" }}>
            <div style={{ marginBottom: "36px" }}>
              <h2 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>Why 2,000+ Businesses Choose AF Apparels</h2>
              <p style={{ fontSize: "14px", color: "#64748B", maxWidth: "560px", lineHeight: 1.6 }}>Factory-direct isn&apos;t just a price story. It&apos;s a reliability story.</p>
            </div>
            {rows.map(({ num, h, p }) => (
              <div key={num} style={{ display: "flex", gap: "14px", marginBottom: "18px", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "22px", fontWeight: 800, color: "#E8242A", minWidth: "28px", lineHeight: 1, marginTop: "1px" }}>{num}</div>
                <div>
                  <h4 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "15px", fontWeight: 700, marginBottom: "3px", color: "#0F172A" }}>{h}</h4>
                  <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.55 }}>{p}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:flex" style={{ flex: 1, minWidth: "240px" }}>
            <div style={{ height: "360px", width: "100%", overflow: "hidden", borderRadius: "4px", border: "1px solid #E2E8F0" }}>
              <img
                src="/private_labels_af.webp"
                alt="Warehouse / Fulfillment Center"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
