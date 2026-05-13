export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  published_date: string | null;
  read_time: string | null;
  excerpt: string | null;
  tags: string[];
}

interface PageSeo {
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const r = await fetch(`${API}/api/v1/pages-seo/blog`, { next: { revalidate: 300 } });
    if (!r.ok) return { title: "Blog — AF Apparels" };
    const seo: PageSeo = await r.json();
    return {
      title: seo.meta_title ?? "Blog — AF Apparels",
      description: seo.meta_description ?? "Industry insights, print tips, and wholesale apparel news from AF Apparels.",
      openGraph: seo.og_image_url ? { images: [{ url: seo.og_image_url }] } : undefined,
    };
  } catch {
    return { title: "Blog — AF Apparels" };
  }
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const r = await fetch(`${API}/api/v1/blog-posts`, { cache: "no-store" });
    if (!r.ok) return [];
    const data: unknown = await r.json();
    return Array.isArray(data) ? (data as BlogPost[]) : [];
  } catch {
    return [];
  }
}

export default async function BlogListingPage() {
  const posts = await getPosts();

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "#1B3A5C", padding: "48px 0 40px", borderBottom: "3px solid #E8242A" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: "38px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
            AF Apparels Blog
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,.6)", maxWidth: "560px" }}>
            Industry insights, print tips, and wholesale apparel news.
          </p>
        </div>
      </div>

      <style>{`
        .blog-card { transition: box-shadow .2s; }
        .blog-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.10); }
      `}</style>

      {/* Posts Grid */}
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "48px 24px" }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#7A7880" }}>
            <p style={{ fontSize: "16px" }}>No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }} className="blog-grid">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <article className="blog-card" style={{ background: "#fff", border: "1px solid #E2E0DA", borderRadius: "12px", overflow: "hidden", cursor: "pointer" }}>
                  {/* Cover */}
                  <div style={{ height: "200px", background: "#F4F3EF", overflow: "hidden" }}>
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1B3A5C" }}>
                        <span style={{ fontSize: "36px", color: "rgba(255,255,255,.3)" }}>✍</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "18px" }}>
                    {/* Tags */}
                    {(post.tags || []).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }}>
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ background: "rgba(232,36,42,.08)", color: "#E8242A", padding: "2px 9px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1B3A5C", lineHeight: 1.35, marginBottom: "8px" }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p style={{ fontSize: "13px", color: "#7A7880", lineHeight: 1.6, marginBottom: "12px" }}>
                        {post.excerpt.length > 110 ? post.excerpt.slice(0, 110) + "…" : post.excerpt}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "12px", color: "#aaa" }}>
                      {post.published_date && <span>{new Date(post.published_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                      {post.read_time && <span>· {post.read_time}</span>}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
