"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";

type Tab = "google" | "email";
type Mode = "signin" | "signup";

export default function SplashScreen() {
  const { status } = useSession();
  const [tab, setTab] = useState<Tab>("google");
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") return null;
  if (status === "loading") {
    return <div className="fixed inset-0 bg-[#09090B] z-[100]" />;
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-[#09090B] z-[100] flex flex-col items-center justify-center overflow-hidden">

      {/* ── Dohyo ring + rikishi ─────────────────────────────────── */}
      <motion.svg viewBox="0 0 220 220" className="w-72 h-72" aria-hidden>
        <motion.circle
          cx="110" cy="110" r="100"
          fill="none" stroke="#D4A97A" strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.circle
          cx="110" cy="110" r="88"
          fill="none" stroke="#D4A97A" strokeWidth="1.5" strokeDasharray="4 6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 1.6, duration: 0.4 }}
        />

        {/* West rikishi */}
        <motion.g
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5, ease: "easeOut" }}
        >
          <ellipse cx="76" cy="76" rx="5" ry="4" fill="white" />
          <circle cx="76" cy="88" r="12" fill="white" />
          <ellipse cx="76" cy="114" rx="22" ry="19" fill="white" />
          <ellipse cx="57" cy="108" rx="9" ry="6" fill="white" transform="rotate(-25 57 108)" />
          <ellipse cx="95" cy="106" rx="9" ry="6" fill="white" transform="rotate(20 95 106)" />
          <ellipse cx="66" cy="130" rx="9" ry="7" fill="white" />
          <ellipse cx="86" cy="130" rx="9" ry="7" fill="white" />
          <rect x="58" y="111" width="36" height="9" rx="2" fill="#C0292A" />
        </motion.g>

        {/* East rikishi */}
        <motion.g
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5, ease: "easeOut" }}
        >
          <ellipse cx="144" cy="76" rx="5" ry="4" fill="white" />
          <circle cx="144" cy="88" r="12" fill="white" />
          <ellipse cx="144" cy="114" rx="22" ry="19" fill="white" />
          <ellipse cx="163" cy="108" rx="9" ry="6" fill="white" transform="rotate(25 163 108)" />
          <ellipse cx="125" cy="106" rx="9" ry="6" fill="white" transform="rotate(-20 125 106)" />
          <ellipse cx="134" cy="130" rx="9" ry="7" fill="white" />
          <ellipse cx="154" cy="130" rx="9" ry="7" fill="white" />
          <rect x="126" y="111" width="36" height="9" rx="2" fill="#2563EB" />
        </motion.g>
      </motion.svg>

      {/* ── 相撲 kanji ───────────────────────────────────────────── */}
      <motion.div
        className="mt-4 font-display font-black text-6xl text-[#FAFAFA] leading-none select-none"
        initial={{ scale: 1.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.35, ease: [0.2, 0, 0.1, 1] }}
      >
        相撲
      </motion.div>

      {/* ── Brand ────────────────────────────────────────────────── */}
      <motion.p
        className="mt-2 font-display font-semibold text-base tracking-[0.35em] text-[#D4A97A] uppercase"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.1, duration: 0.4 }}
      >
        dohyo
      </motion.p>

      {/* ── Auth ─────────────────────────────────────────────────── */}
      <motion.div
        className="mt-8 w-full max-w-xs flex flex-col items-center gap-0"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6, duration: 0.5 }}
      >
        {/* Tabs */}
        <div className="flex w-full rounded-lg overflow-hidden border border-[#27272A] mb-4">
          <button
            onClick={() => { setTab("google"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
              tab === "google" ? "bg-[#27272A] text-[#FAFAFA]" : "text-[#52525B] hover:text-[#A1A1AA]"
            }`}
          >
            Google
          </button>
          <button
            onClick={() => { setTab("email"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
              tab === "email" ? "bg-[#27272A] text-[#FAFAFA]" : "text-[#52525B] hover:text-[#A1A1AA]"
            }`}
          >
            Email
          </button>
        </div>

        {tab === "google" ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-3 w-full bg-[#FAFAFA] text-[#09090B] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white transition-colors duration-200 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            <p className="text-[#52525B] text-xs">Save your favourite rikishi across devices</p>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3 w-full">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#D4A97A] transition-colors"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#D4A97A] transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#D4A97A] transition-colors"
            />
            {error && (
              <p className="text-[#C0292A] text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C0292A] hover:bg-[#A82424] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 cursor-pointer"
            >
              {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
            <button
              type="button"
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
              className="text-[#52525B] hover:text-[#A1A1AA] text-xs transition-colors cursor-pointer"
            >
              {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
