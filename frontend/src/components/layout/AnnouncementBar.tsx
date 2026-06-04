function AnnouncementBarInner() {
  return (
    <div style={{ background: '#1C3557', color: '#fff', textAlign: 'center', padding: '8px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      Wholesale Blank Apparel
      <span className="hidden sm:inline">&nbsp;·&nbsp;Serving 2,000+ US Businesses&nbsp;·&nbsp;Same-Day Shipping from Dallas, TX</span>
      &nbsp;·&nbsp;(214) 272-7213
    </div>
  );
}

export default AnnouncementBarInner;
export { AnnouncementBarInner as AnnouncementBar };

