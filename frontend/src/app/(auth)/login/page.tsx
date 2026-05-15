// frontend/src/app/(auth)/login/page.tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import type ReCAPTCHAType from "react-google-recaptcha";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { ApiClientError, setAccessToken } from "@/lib/api-client";
import { FactoryIcon, ZapIcon, CreditCardIcon } from "@/components/ui/icons";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
}) as typeof ReCAPTCHAType;

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const recaptchaRef = useRef<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResendActivation, setShowResendActivation] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [showPendingApproval, setShowPendingApproval] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }
    setIsSubmitting(true);

    try {
      const tokens = await authService.login({ email, password });

      // Set token in memory BEFORE calling getProfile so the request is authenticated
      setAccessToken(tokens.access_token);

      const profile = await authService.getProfile();

      // JWT payload contains is_admin and account_type as claims
      const payload = decodeJwtPayload(tokens.access_token);
      const fullProfile = { ...profile, is_admin: !!payload.is_admin, account_type: (payload.account_type as string) || "wholesale" };

      setAuth(tokens.access_token, fullProfile);

      if (fullProfile.is_admin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/account");
      }
    } catch (err) {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      if (err instanceof ApiClientError) {
        if (err.code === "ACCOUNT_SUSPENDED") {
          setError("Your account has been suspended. Please contact support.");
        } else if (err.code === "ACCOUNT_NOT_ACTIVATED") {
          setError("Your account is not yet activated. Check your email for the activation link.");
          setShowResendActivation(true);
        } else if (err.code === "ACCOUNT_PENDING_APPROVAL") {
          setError(null);
          setShowPendingApproval(true);
        } else if (err.code === "UNAUTHORIZED") {
          setError(err.message || "Invalid email or password. Please try again.");
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendActivation() {
    setResendSent(false);
    try {
      await fetch(`${API_BASE}/api/v1/resend-activation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResendSent(true);
    } catch {
      // non-fatal
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1B3A5C", fontFamily: "var(--font-jakarta)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      {/* <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/Af-apparel logo.jpeg" alt="AF Apparels Logo" style={{ height: "50px", width: "auto", objectFit: "contain" }} />
        </Link>
      </div> */}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(28px,4vw,40px)", color: "#fff", letterSpacing: ".02em", lineHeight: 1, marginBottom: "8px" }}>
              Sign In
            </h1>
            <p style={{ fontSize: "15px", color: "#d3d0d0", fontWeight: 500 }}>
              Access your wholesale account
            </p>
          </div>

          {/* Card */}
          <div style={{ background: "#0F2340", border: "1px solid rgba(255,255,255,.12)", borderRadius: "12px", padding: "36px" }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: "rgba(232,36,42,.12)", border: "1px solid rgba(232,36,42,.3)", borderRadius: "6px", padding: "12px 14px", fontSize: "13px", color: "#f87171", marginBottom: "12px" }}>
                  {error}
                </div>
              )}

              {showResendActivation && (
                <div style={{ marginBottom: "20px", padding: "14px 16px", background: "rgba(255,248,225,.06)", border: "1px solid rgba(255,224,130,.25)", borderRadius: "8px" }}>
                  {resendSent ? (
                    <p style={{ fontSize: "13px", color: "#86efac", margin: 0 }}>
                      Activation email sent! Check your inbox.
                    </p>
                  ) : (
                    <>
                      <p style={{ fontSize: "13px", color: "#d3d0d0", margin: "0 0 10px" }}>
                        {"Didn't receive the activation email?"}
                      </p>
                      <button
                        type="button"
                        onClick={handleResendActivation}
                        style={{ background: "#1B3A5C", color: "#fff", border: "none", padding: "9px 18px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}
                      >
                        Resend Activation Email
                      </button>
                    </>
                  )}
                </div>
              )}

              {showPendingApproval && (
                <div style={{ marginBottom: "20px", padding: "16px", background: "rgba(26,92,255,.08)", border: "1px solid rgba(26,92,255,.3)", borderRadius: "8px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#93c5fd", margin: "0 0 6px" }}>
                    Application Under Review
                  </p>
                  <p style={{ fontSize: "13px", color: "#d3d0d0", margin: 0, lineHeight: 1.5 }}>
                    Your wholesale application is currently being reviewed by our team. You will receive an email within 1–2 business days once a decision has been made.
                  </p>
                  <p style={{ fontSize: "12px", color: "#7A7880", margin: "8px 0 0" }}>
                    Questions? Call <a href="tel:+14693679753" style={{ color: "#93c5fd", textDecoration: "none" }}>+1 (469) 367-9753</a>
                  </p>
                </div>
              )}

              <div style={{ marginBottom: "18px" }}>
                <label
                  htmlFor="email"
                  style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#7A7880", marginBottom: "6px" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
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
                    transition: "border-color .2s",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label
                    htmlFor="password"
                    style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#7A7880" }}
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    style={{ fontSize: "12px", color: "#1A5CFF", textDecoration: "none", fontWeight: 600 }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                    transition: "border-color .2s",
                  }}
                />
              </div>

              {/* reCAPTCHA */}
              <div className="recaptcha-wrap" style={{ marginBottom: "20px" }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                  theme="dark"
                />
                {!recaptchaToken && (
                  <p style={{ fontSize: "11px", color: "#666", marginTop: "6px" }}>Please complete the verification above to sign in.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !recaptchaToken}
                style={{
                  width: "100%",
                  background: (isSubmitting || !recaptchaToken) ? "#555" : "#E8242A",
                  color: "#fff",
                  padding: "13px",
                  fontSize: "14px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: (isSubmitting || !recaptchaToken) ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  transition: "background .2s",
                }}
              >
                {isSubmitting ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,.06)", textAlign: "center", fontSize: "13px", color: "#aaa" }}>
              {"Don't have an account? "}
              <Link
                href="/wholesale/register"
                style={{ color: "#1A5CFF", fontWeight: 700, textDecoration: "none" }}
              >
                Apply for Wholesale Access
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {[
              { icon: <FactoryIcon size={20} color="#aaa" />, text: "Factory-Direct" },
              { icon: <ZapIcon size={20} color="#aaa" />, text: "Same-Day Ship" },
              { icon: <CreditCardIcon size={20} color="#aaa" />, text: "NET 30 Terms" },
            ].map((item) => (
              <div key={item.text} style={{ textAlign: "center", padding: "12px 8px", background: "#0F2340", border: "1px solid rgba(255,255,255,.1)", borderRadius: "8px" }}>
                <div style={{ marginBottom: "4px", display: "flex", justifyContent: "center" }}>{item.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: ".06em" }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 32px", borderTop: "1px solid rgba(255,255,255,.06)", textAlign: "center", fontSize: "12px", color: "#888" }}>
        © {new Date().getFullYear()} AF Apparels · Dallas, TX ·{" "}
        <a href="tel:+14693679753" style={{ color: "#aaa", textDecoration: "none" }}>+1 (469) 367-9753</a>
      </div>
    </div>
  );
}
