"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { setAccessToken } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth.store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const part = token.split(".")[1];
    if (!part) return {};
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

function ResendForm({ defaultEmail }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    if (!email) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/v1/resend-activation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ color: "#059669", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
          Activation email sent!
        </p>
        <p style={{ color: "#aaa", fontSize: "13px" }}>Check your inbox and spam folder.</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: "#ccc", fontSize: "14px", marginBottom: "16px" }}>
        Enter your email to receive a new activation link.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{
          width: "100%",
          background: "#1E1D24",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: "6px",
          padding: "10px 14px",
          fontSize: "14px",
          color: "#fff",
          outline: "none",
          boxSizing: "border-box",
          marginBottom: "12px",
        }}
      />
      <button
        onClick={handleResend}
        disabled={loading || !email}
        style={{
          width: "100%",
          background: loading || !email ? "#555" : "#1B3A5C",
          color: "#fff",
          padding: "12px",
          fontSize: "14px",
          fontWeight: 700,
          borderRadius: "6px",
          border: "none",
          cursor: loading || !email ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Sending…" : "Resend Activation Email"}
      </button>
    </div>
  );
}

function ActivateAccountContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenExpired, setTokenExpired] = useState(false);

  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ color: "#f87171", marginBottom: "16px" }}>Invalid activation link.</p>
        <Link href="/login" style={{ color: "#1A5CFF", fontWeight: 700, textDecoration: "none" }}>
          Back to Login
        </Link>
      </div>
    );
  }

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/activate-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirm_password: confirm }),
      });
      const data = await res.json();

      if (!res.ok) {
        const detail = data.detail || data.error?.message || "Activation failed";
        if (detail.toLowerCase().includes("expired")) {
          setTokenExpired(true);
        } else {
          setError(detail);
        }
        return;
      }

      // Save token + redirect
      setAccessToken(data.access_token);
      const payload = decodeJwtPayload(data.access_token);
      setAuth(data.access_token, {
        ...data.user,
        is_admin: !!payload.is_admin,
        account_type: "retail",
      });
      router.push("/account/orders?activated=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {tokenExpired ? (
        <>
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(24px,4vw,36px)",
              color: "#fff",
              letterSpacing: ".02em",
              lineHeight: 1,
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Link Expired
          </h1>
          <p style={{ fontSize: "14px", color: "#d3d0d0", marginBottom: "28px", textAlign: "center" }}>
            Your activation link has expired. Request a new one below.
          </p>
          <div
            style={{
              background: "#0F2340",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <ResendForm />
          </div>
        </>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(28px,4vw,40px)",
                color: "#fff",
                letterSpacing: ".02em",
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              Create Your Password
            </h1>
            <p style={{ fontSize: "15px", color: "#d3d0d0", fontWeight: 500 }}>
              Set a password to access your order history and account.
            </p>
          </div>

          <div
            style={{
              background: "#0F2340",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "12px",
              padding: "36px",
            }}
          >
            <form onSubmit={handleActivate}>
              {error && (
                <div
                  style={{
                    background: "rgba(232,36,42,.12)",
                    border: "1px solid rgba(232,36,42,.3)",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    fontSize: "13px",
                    color: "#f87171",
                    marginBottom: "20px",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "18px" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    color: "#7A7880",
                    marginBottom: "6px",
                  }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  style={{
                    width: "100%",
                    background: "#1E1D24",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  htmlFor="confirm"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    color: "#7A7880",
                    marginBottom: "6px",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  style={{
                    width: "100%",
                    background: "#1E1D24",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "#555" : "#E8242A",
                  color: "#fff",
                  padding: "13px",
                  fontSize: "14px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {loading ? "Activating…" : "Activate Account →"}
              </button>
            </form>

            <div
              style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255,255,255,.06)",
                textAlign: "center",
                fontSize: "13px",
                color: "#aaa",
              }}
            >
              Already have a password?{" "}
              <Link href="/login" style={{ color: "#1A5CFF", fontWeight: 700, textDecoration: "none" }}>
                Sign In
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ActivateAccountPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1B3A5C",
        fontFamily: "var(--font-jakarta)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <Suspense fallback={<div style={{ color: "#fff", textAlign: "center" }}>Loading…</div>}>
            <ActivateAccountContent />
          </Suspense>
        </div>
      </div>

      <div
        style={{
          padding: "20px 32px",
          borderTop: "1px solid rgba(255,255,255,.06)",
          textAlign: "center",
          fontSize: "12px",
          color: "#888",
        }}
      >
        © {new Date().getFullYear()} AF Apparels · Dallas, TX ·{" "}
        <a href="tel:+12142727213" style={{ color: "#aaa", textDecoration: "none" }}>
          (214) 272-7213
        </a>
      </div>
    </div>
  );
}
