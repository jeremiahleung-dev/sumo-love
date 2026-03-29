"use client";

import { motion } from "framer-motion";

export default function TwistAnimation() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="w-full max-w-xs mx-auto"
      aria-label="Twist technique animation"
    >
      {/* Dohyo */}
      <ellipse cx="100" cy="128" rx="85" ry="8" fill="none" stroke="#D4A97A" strokeWidth="2" />

      {/* Winner — pivots and pulls down */}
      <motion.g
        animate={{ rotate: [0, -20, -20, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.35, 0.65, 1] }}
        style={{ transformOrigin: "78px 88px" }}
      >
        <ellipse cx="78" cy="88" rx="17" ry="22" fill="#1A1A1A" />
        <circle cx="78" cy="63" r="11" fill="#1A1A1A" />
        <rect x="63" y="96" width="28" height="6" rx="2" fill="#C0292A" />
        <line x1="93" y1="82" x2="112" y2="78" stroke="#1A1A1A" strokeWidth="7" strokeLinecap="round" />
      </motion.g>

      {/* Loser — corkscrews down */}
      <motion.g
        animate={{ rotate: [0, 0, 120, 120], y: [0, 0, 22, 22] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.3, 0.7, 1] }}
        style={{ transformOrigin: "120px 88px" }}
      >
        <ellipse cx="120" cy="85" rx="16" ry="20" fill="#D4A97A" />
        <circle cx="120" cy="62" r="11" fill="#D4A97A" />
        <rect x="106" y="93" width="28" height="5" rx="2" fill="#8B1A1A" />
        <line x1="107" y1="82" x2="96" y2="77" stroke="#D4A97A" strokeWidth="7" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}
